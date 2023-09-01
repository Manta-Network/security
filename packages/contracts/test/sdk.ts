// browser non-compatible 

// browser compatible 
import {Contract, ethers, Signer} from "ethers"

export async function createWallet(
  privateKey : string,
  rpcUrl : string
) {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const signer = wallet.connect(provider);
  return signer
}

export async function tx2contract(
  contractAddress : string,
  contractAbi : string[],
  funcName : string,
  funcParams : any,
  signer: Signer,
  value : bigint,
  gasLimit : bigint
  // TODO : gasPrice = fast/average gasPrice + 1
) {
  const c : Contract = new ethers.Contract(contractAddress, contractAbi, signer);
  if (!(funcName in c)) {
    throw new Error(`Function ${funcName} does not exist in the contract.`);
  }

  //const gasPrice = await signer.getGasPrice()

  const transaction = await c[funcName](
    ...funcParams,
    {
      value : value,
      gasLimit : gasLimit
    }
  );
  return await transaction.wait()
}

export async function getGasPrice(
  rpcUrl : string
) {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  return await provider.getGasPrice()
}

