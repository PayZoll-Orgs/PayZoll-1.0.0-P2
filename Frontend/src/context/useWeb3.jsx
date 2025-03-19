import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import { CHAINS } from "../constant/chain";

// Create the context
const Web3Context = createContext();

// Define native token placeholder
const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

// Minimal ABIs
const bulkPayrollAbi = [
  "function bulkTransfer(address token, address[] calldata recipients, uint256[] calldata amounts) external payable",
];

const tokenAbi = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
];

// Web3Provider component
export const Web3Provider = ({ children }) => {
  // Basic web3 state
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [balance, setBalance] = useState(null);

  // Chain/token selection state
  const [selectedChain, setSelectedChain] = useState(CHAINS[0]);
  const [selectedToken, setSelectedToken] = useState(CHAINS[0].tokens[0]);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const isSwitchingNetwork = useRef(false);

  // Initialize web3 connection
  const initWeb3 = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Initialize provider with ENS disabled
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);

        const ethSigner = await ethersProvider.getSigner();
        const currentAccount = await ethSigner.getAddress();
        const accountBalance = await ethersProvider.getBalance(currentAccount);
        const currNetwork = await ethersProvider.getNetwork();

        // Set state
        setProvider(ethersProvider);
        setSigner(ethSigner);
        setAccount(currentAccount);
        setNetwork(currNetwork);
        setBalance(accountBalance);

        // Set selected chain based on connected network
        const chainId = Number(currNetwork.chainId);
        const chain = CHAINS.find((c) => c.chainId === chainId);
        if (chain) {
          setSelectedChain(chain);
          setSelectedToken(chain.tokens[0]);
        }

        return { provider: ethersProvider, signer: ethSigner, account: currentAccount };
      } catch (error) {
        console.error("Error initializing web3: ", error);
        showNotification("error", "Failed to connect to wallet");
        return null;
      }
    } else {
      console.error("Ethereum provider not found. Install MetaMask!");
      showNotification("error", "No Ethereum wallet detected");
      return null;
    }
  };

  // Display notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 5000);
  };

  // Handle account changes
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
      setAccount(null);
      setSigner(null);
      showNotification("info", "Wallet disconnected");
    } else {
      try {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        const updatedSigner = await ethersProvider.getSigner();
        const updatedAccount = await updatedSigner.getAddress();
        const currNetwork = await ethersProvider.getNetwork();
        const userBalance = await ethersProvider.getBalance(updatedAccount);

        setSigner(updatedSigner);
        setAccount(updatedAccount);
        setNetwork(currNetwork);
        setBalance(userBalance);
        showNotification("success", "Account connected: " + updatedAccount.substring(0, 6) + "..." + updatedAccount.substring(updatedAccount.length - 4));
      } catch (error) {
        console.error("Error handling account change:", error);
        showNotification("error", "Failed to update account");
      }
    }
  };

  // Handle chain changes
  const handleChainChanged = async (chainId) => {
    try {
      // Convert to decimal
      const decimalChainId = parseInt(chainId, 16);
      console.log("MetaMask chain changed to:", decimalChainId);

      // Find and set the chain
      const chain = CHAINS.find((c) => c.chainId === decimalChainId);
      if (chain) {
        setSelectedChain(chain);
        setSelectedToken(chain.tokens[0]);
        showNotification("info", `Connected to ${chain.name}`);

        // Update provider and related info
        if (window.ethereum) {
          const ethersProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(ethersProvider);

          // Update signer and account info
          if (account) {
            const updatedSigner = await ethersProvider.getSigner();
            setSigner(updatedSigner);
            const userBalance = await ethersProvider.getBalance(account);
            setBalance(userBalance);
          }

          const currNetwork = await ethersProvider.getNetwork();
          setNetwork(currNetwork);
        }
      } else {
        showNotification("warning", "Connected to unsupported network");
      }
    } catch (error) {
      console.error("Error handling chain change:", error);
      showNotification("error", "Failed to update network information");
    }
  };

  // Handle token selection change
  const handleTokenChange = (tokenAddress) => {
    const token = selectedChain.tokens.find((t) => t.address === tokenAddress);
    if (token) {
      setSelectedToken(token);
      return token;
    }
    return null;
  };

  // Add token to wallet
  const addTokenToWallet = async (token = selectedToken) => {
    if (!window.ethereum) {
      showNotification("error", "MetaMask not detected");
      return false;
    }

    // Skip for native tokens (which use the zero address)
    if (token.address === NATIVE_TOKEN_ADDRESS) {
      showNotification("info", `${token.symbol} is a native token and already in your wallet`);
      return true;
    }

    try {
      // Request to add the token to user's wallet
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals || 18,
          },
        },
      });

      if (wasAdded) {
        showNotification("success", `${token.symbol} added to your wallet!`);
        return true;
      } else {
        showNotification("info", "Token was not added to your wallet");
        return false;
      }
    } catch (error) {
      console.error("Error adding token to wallet:", error);
      showNotification("error", "Failed to add token to wallet");
      return false;
    }
  };

  // Switch network or add if it doesn't exist
  const switchNetwork = async (chainId) => {
    if (!window.ethereum) {
      showNotification("error", "No wallet detected");
      return false;
    }

    // Prevent multiple simultaneous network switching attempts
    if (isSwitchingNetwork.current) return false;

    try {
      isSwitchingNetwork.current = true;

      // Find chain data
      const chain = CHAINS.find((c) => c.chainId === chainId);
      if (!chain) {
        showNotification("error", "Invalid chain ID");
        return false;
      }

      // First update state for better UX
      setSelectedChain(chain);
      setSelectedToken(chain.tokens[0]);

      // Then request MetaMask to switch networks
      const hexChainId = `0x${chainId.toString(16)}`;

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: hexChainId }],
        });

        showNotification("success", `Switched to ${chain.name}`);
        return true;
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: hexChainId,
                  chainName: chain.name,
                  nativeCurrency: {
                    name: chain.nativeCurrency?.name || chain.symbol,
                    symbol: chain.nativeCurrency?.symbol || chain.symbol,
                    decimals: chain.nativeCurrency?.decimals || 18,
                  },
                  rpcUrls: [chain.rpcUrl],
                  blockExplorerUrls: chain.blockExplorer ? [chain.blockExplorer] : undefined,
                },
              ],
            });
            showNotification("success", `Added and switched to ${chain.name}`);
            return true;
          } catch (addError) {
            console.error("Error adding chain:", addError);
            showNotification("error", `Failed to add ${chain.name} network`);
            return false;
          }
        } else {
          console.error("Error switching chain:", switchError);
          showNotification("error", `Failed to switch to ${chain.name}`);
          return false;
        }
      }
    } catch (error) {
      console.error("Chain switch error:", error);
      showNotification("error", "Error switching networks");
      return false;
    } finally {
      isSwitchingNetwork.current = false;
    }
  };

  // Calculate gas limit based on number of recipients
  const calculateGasLimit = (recipientCount, isNativeToken) => {
    const baseGas = isNativeToken ? 21000 : 65000; // Higher base for ERC20
    const perRecipientGas = isNativeToken ? 30000 : 60000; // Higher per-recipient for ERC20
    return Math.ceil((baseGas + perRecipientGas * recipientCount) * 1.5);
  };

  // Send bulk transfer transaction
  const sendBulkTransfer = async (recipientAddresses, amounts, token = selectedToken, chain = selectedChain) => {
    if (!window.ethereum) {
      showNotification("error", "No wallet detected");
      return null;
    }

    try {
      // Validate inputs
      if (recipientAddresses.length !== amounts.length) {
        throw new Error("Recipients and amounts length mismatch");
      }

      // Validate addresses
      for (const address of recipientAddresses) {
        if (!address.startsWith("0x") || address.length !== 42) {
          throw new Error(`Invalid address format: ${address}`);
        }
        if (!ethers.isAddress(address)) {
          throw new Error(`Invalid address: ${address}`);
        }
      }

      // Get current provider and signer (or initialize if needed)
      let currentProvider = provider;
      let currentSigner = signer;

      if (!currentProvider || !currentSigner) {
        const web3 = await initWeb3();
        if (!web3) return null;
        currentProvider = web3.provider;
        currentSigner = web3.signer;
      }

      // Ensure correct network
      const network = await currentProvider.getNetwork();
      if (network.chainId !== BigInt(chain.chainId)) {
        const switched = await switchNetwork(chain.chainId);
        if (!switched) {
          throw new Error(`Please switch to ${chain.name} in your wallet`);
        }

        // Refresh provider and signer after network switch
        currentProvider = new ethers.BrowserProvider(window.ethereum);
        currentSigner = await currentProvider.getSigner();
      }

      // Parse amounts to BigInt using token decimals
      const decimals = token.decimals || 18;
      const parsedAmounts = amounts.map((a) => ethers.parseUnits(a.toString(), decimals));
      const totalAmount = parsedAmounts.reduce((acc, curr) => acc + BigInt(curr), BigInt(0));

      // Instantiate contract
      const contract = new ethers.Contract(chain.contractAddress, bulkPayrollAbi, currentSigner);

      // Verify contract address
      if (!chain.contractAddress || !ethers.isAddress(chain.contractAddress)) {
        throw new Error(`Invalid contract address for ${chain.name}: ${chain.contractAddress}`);
      }

      const isNativeToken = token.address === NATIVE_TOKEN_ADDRESS;
      const gasLimit = calculateGasLimit(recipientAddresses.length, isNativeToken);

      let tx;
      if (isNativeToken) {
        // Check native token balance
        const balance = await currentProvider.getBalance(await currentSigner.getAddress());
        if (balance < totalAmount) {
          throw new Error(`Insufficient ${token.symbol} balance for transfer`);
        }

        tx = await contract.bulkTransfer(
          NATIVE_TOKEN_ADDRESS,
          recipientAddresses,
          parsedAmounts,
          {
            value: totalAmount,
            gasLimit: gasLimit,
          }
        );
      } else {
        // For ERC20 tokens
        const tokenContract = new ethers.Contract(token.address, tokenAbi, currentSigner);
        const owner = await currentSigner.getAddress();

        // Check token balance
        const balance = await tokenContract.balanceOf(owner);
        if (BigInt(balance) < totalAmount) {
          throw new Error(`Insufficient ${token.symbol} balance for transfer`);
        }

        // Check and handle token approval
        const allowance = await tokenContract.allowance(owner, chain.contractAddress);
        if (BigInt(allowance) < totalAmount) {
          showNotification("info", `Approving ${token.symbol} for spending...`);

          const approveTx = await tokenContract.approve(chain.contractAddress, totalAmount, {
            gasLimit: 100000,
          });

          showNotification("info", `Approval transaction sent: ${approveTx.hash.substring(0, 10)}...`);
          await approveTx.wait();
          showNotification("success", "Token approval successful");
        }

        // Execute bulk transfer
        tx = await contract.bulkTransfer(token.address, recipientAddresses, parsedAmounts, {
          gasLimit: gasLimit,
        });
      }

      showNotification(
        "success",
        `Transaction sent: ${tx.hash.substring(0, 10)}...${tx.hash.substring(tx.hash.length - 4)}`
      );

      // Wait for receipt with timeout
      const receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Transaction confirmation timed out")), 120000);
        }),
      ]);

      showNotification("success", "Bulk transfer completed successfully!");
      return { success: true, receipt, tx };
    } catch (error) {
      console.error("Bulk transfer error:", error);

      // Extract useful error message
      let errorMsg = error.message;
      if (error.data) {
        errorMsg = `Contract error: ${error.data.message || error.message}`;
      } else if (error.error && error.error.message) {
        errorMsg = error.error.message;
      }

      showNotification("error", errorMsg);
      return { success: false, error };
    }
  };

  // Initialize on component mount
  useEffect(() => {
    initWeb3();

    // Add MetaMask event listeners
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    // Clean up event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  // Create context value
  const contextValue = {
    // State
    provider,
    signer,
    account,
    network,
    balance,
    selectedChain,
    selectedToken,
    notification,

    // Actions
    initWeb3,
    switchNetwork,
    handleTokenChange,
    addTokenToWallet,
    sendBulkTransfer,
    showNotification,
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook for using the Web3 context
export const useWeb3 = () => {
  return useContext(Web3Context);
};
