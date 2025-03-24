import { Contract, ethers } from "ethers";
import lendingJson from "../artifacts/contracts/Lending.sol/Lending.json";

const lendingContractAddress = "0xf34539062a65D838FE281b744b297a0E60336758";

async function deployLendingContract(signer) {
  const contractFactory = new ethers.ContractFactory(
    lendingJson.abi,
    lendingJson.bytecode,
    signer
  );
  const contract = await contractFactory.deploy();
  const contractDeployed = await contract.waitForDeployment();
  console.log(contractDeployed);
  return contractDeployed.target;
}

async function getBalance(provider) {
  const contract = new Contract(
    lendingContractAddress,
    lendingJson.abi,
    provider
  );
  const balance = await contract.getBalance();
  console.log(balance);
  return Number(balance);
}

async function depositEther(signer, amountInEth) {
  try {
    const contract = new Contract(
      lendingContractAddress,
      lendingJson.abi,
      signer
    );
    const tx = await contract.deposit({
      value: ethers.parseEther(amountInEth),
    });
    console.log("Deposit transaction sent:", tx.hash);
    await tx.wait();
    console.log("Deposit confirmed!");
  } catch (error) {
    console.error("Error depositing Dollar:", error);
  }
}

// Function to withdraw Dollar
async function withdrawEther(signer, amountInEth) {
  try {
    const contract = new Contract(
        lendingContractAddress,
        lendingJson.abi,        signer
      );
    const amountInWei = ethers.parseEther(amountInEth);
    const tx = await contract.withdraw(amountInWei);
    console.log("Withdraw transaction sent:", tx.hash);
    await tx.wait();
    console.log("Withdraw confirmed!");
  } catch (error) {
    console.error("Error withdrawing Dollar:", error);
  }
}

export { deployLendingContract, getBalance, depositEther, withdrawEther };
