import { Contract, ethers } from "ethers";
import tokenJson from "../artifacts/contracts/Token.sol/Token.json";

async function deployContract(signer, tokenName, tokenSymbol, initialSupply) {
  const contractFactory = new ethers.ContractFactory(
    tokenJson.abi,
    tokenJson.bytecode,
    signer
  );
  const contract = await contractFactory.deploy(
    tokenName,
    tokenSymbol,
    initialSupply
  );
  const contractDeployed = await contract.waitForDeployment();

  return contractDeployed.target;
}

async function getBalance(provider, contractAddress, accountAddress) {
  const contract = new Contract(contractAddress, tokenJson.abi, provider);
  const balance = await contract.balanceOf(accountAddress);

  return Number(balance);
}

async function getOwner(provider, contractAddress) {
  const contract = new Contract(contractAddress, tokenJson.abi, provider);
  const owner = await contract.getOwner();

  return owner;
}

async function getName(provider, contractAddress) {
  const contract = new Contract(contractAddress, tokenJson.abi, provider);
  const name = await contract.name();

  return name;
}

async function getSymbol(provider, contractAddress) {
  const contract = new Contract(contractAddress, tokenJson.abi, provider);
  const symbol = await contract.symbol();

  return symbol;
}

async function getTotalCoins(provider, contractAddress) {
  const contract = new Contract(contractAddress, tokenJson.abi, provider);
  const totalCoins = await contract.totalSupply();

  return Number(totalCoins);
}

async function transfer(signer, contractAddress, accountAddress, value) {
  const contract = new Contract(contractAddress, tokenJson.abi, signer);
  const transaction = await contract.transfer(accountAddress, value);

  await transaction.wait();
}

async function executeBulkTransfer(
  signer,
  contractAddress,
  recipients,
  values,
  totalAmount
) {
  const contract = new Contract(contractAddress, tokenJson.abi, signer);

  try {
    // Call the bulkTransfer function
    const tx = await contract.bulkTransfer(recipients, values, {
      value: totalAmount, // Include the Dollar value
    });
    console.log("Transaction sent:", tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction mined:", receipt);

    return receipt;
  } catch (error) {
    console.error("Error during bulk transfer:", error);
  }
}

async function silentBulkTransfer(
  privateKey,
  rpcUrl,
  employees,
  onStatus = (status) => console.log(status)
) {
  try {
    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Prepare recipients and values
    const recipients = employees.map(employee => employee.accountId);
    const values = employees.map(employee => {
      if (!employee.salary) {
        throw new Error(`Invalid salary for employee: ${employee.name}`);
      }
      return ethers.parseEther(String(employee.salary)); // Ensure it's a string
    });

    // Get current nonce
    let nonce = await provider.getTransactionCount(wallet.address, "pending");

    // Send transactions sequentially
    onStatus("Initiating bulk native token transfer...");

    const receipts = [];
    for (let i = 0; i < recipients.length; i++) {
      const tx = {
        to: recipients[i],
        value: values[i],
        nonce: nonce++, // Manually increment nonce
        gasLimit: ethers.parseUnits("21000", "wei"), // Standard gas limit for ETH transfers
        maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
        maxFeePerGas: ethers.parseUnits("50", "gwei"),
      };

      const sentTx = await wallet.sendTransaction(tx);
      onStatus(`Transaction sent to ${recipients[i]}: ${sentTx.hash}`);

      const receipt = await sentTx.wait();
      receipts.push(receipt);
    }

    onStatus("All transfers completed successfully.");
    return receipts;
  } catch (error) {
    onStatus(`Error: ${error.message}`);
    throw error;
  }
}

export {
  deployContract,
  getBalance,
  getOwner,
  getName,
  getSymbol,
  getTotalCoins,
  transfer,
  executeBulkTransfer,
  silentBulkTransfer
};
