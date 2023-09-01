import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { HackForce, HackForce__factory } from "../../typechain-types";
import { createWallet, tx2contract } from "../sdk";
const hre = require('hardhat');

describe("Hack", function () {
  this.timeout(6000000);

  let signers : SignerWithAddress[]
  let owner: SignerWithAddress;
  let hc : HackForce

  before(async () => {
    signers = await ethers.getSigners()
    owner = signers[0];
    console.log("owner : ", owner.address)

  });


  it("Deploy HackContract", async function () {
    hc = await new HackForce__factory(owner).deploy()
    console.log("hc address : ", hc.address)
    await (await hc.balance({value : 1000})).wait()
  });

  it("hack tx", async function () {
    let signer = owner
    let RECEIVE : string

    const prev_balance = await signers[10].getBalance()
		if (hre.hardhatArguments.network == undefined) {
      RECEIVE = signers[10].address 
    } else {
      RECEIVE = "0x1EcDFDbB30ACa5a3C49c399ba748831981A6D7A3"
    }

    async function tx() {
      
      const abi = [
        "function destruct(address) external"
      ]
    
      const TX_VALUE = ethers.utils.parseEther("0")
      const TX_GAS_LIMIT = BigInt(1000000)
      const reciept = await tx2contract(
        hc.address,
        abi,
        "destruct",
        [RECEIVE],
        signer,
        TX_VALUE.toBigInt(),
        TX_GAS_LIMIT
      )
      console.log("reciept : ", reciept)
    }

    await tx()

		if (hre.hardhatArguments.network == undefined) {
      const inc = (await signers[10].getBalance()).toBigInt() - prev_balance.toBigInt()
      expect(Number(inc)).gt(0)
    }
  });

});



// Test : yarn hardhat test test/security/*.ts --network sepolia