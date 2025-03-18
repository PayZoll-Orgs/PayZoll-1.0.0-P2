import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

// Create the context
const Web3Context = createContext();

// Web3Provider component
export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" });

          // Initialize provider and signer
          const ethersProvider = new ethers.BrowserProvider(window.ethereum);
          const signer = await ethersProvider.getSigner();

          // Get the user's account
          const account = await signer.getAddress();
          const balance = await ethersProvider.getBalance(account);
          const currNetwork = await ethersProvider.getNetwork();

          // Set state
          setProvider(ethersProvider);
          setSigner(signer);
          setAccount(account);
          setNetwork(currNetwork);
          setBalance(balance);
        } catch (error) {
          console.error("Error initializing web3: ", error);
        }
      } else {
        console.error("Ethereum provider not found. Install MetaMask!");
      }
    };

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        console.log("Please connect to MetaMask.");
        setAccount(null);
        setSigner(null);
      } else {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        const updatedSigner = await ethersProvider.getSigner();
        const updatedAccount = await updatedSigner.getAddress();
        const currNetwork = await provider.getNetwork();
        const balance = await ethersProvider.getBalance(updatedAccount);
        setSigner(updatedSigner);
        setAccount(updatedAccount);
        setNetwork(currNetwork);
        setBalance(balance);
      }
    };

    const handleChainChanged = () => {
      // Refresh the page to reinitialize the app
      // window.location.reload();
    };

    initWeb3();

    // Attach event listeners
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      // Cleanup event listeners
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  // Function to switch or add a new chain

  // chainData structure
  // create a chain.ts file to keept this data
  /*
interface ChainData {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

const chains: Record<string, ChainData> = {
  ethereum: {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"],
    blockExplorerUrls: ["https://etherscan.io/"],
  },
  polygon: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  bsc: {
    chainId: "0x38",
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"],
  },
  arbitrum: {
    chainId: "0xa4b1",
    chainName: "Arbitrum One",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io/"],
  },
  optimism: {
    chainId: "0xa",
    chainName: "Optimism",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.optimism.io/"],
    blockExplorerUrls: ["https://optimistic.etherscan.io/"],
  },
  sepolia: {
    chainId: "0xaa36a7",
    chainName: "Ethereum Sepolia",
    nativeCurrency: {
      name: "Sepolia ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.sepolia.org"],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
  },
  mumbai: {
    chainId: "0x13881",
    chainName: "Polygon Mumbai Testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
  bscTestnet: {
    chainId: "0x61",
    chainName: "Binance Smart Chain Testnet",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
  },
};

export default chains;


  */
  const switchOrAddChain = async (chainId, chainData) => {
    if (!window.ethereum) {
      console.error("Ethereum provider not found.");
      return;
    }
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.toBeHex(chainId) }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [chainData],
          });
        } catch (addError) {
          console.error("Failed to add new chain: ", addError);
        }
      } else {
        console.error("Failed to switch chain: ", switchError);
      }
    }
  };

  return (
    <Web3Context.Provider
      value={{ provider, signer, account, network, balance, switchOrAddChain }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook for using the Web3 context
export const useWeb3 = () => {
  return useContext(Web3Context);
};
