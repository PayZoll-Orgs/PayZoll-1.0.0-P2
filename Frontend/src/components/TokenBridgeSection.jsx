import React, { useState, useEffect } from "react";
import { ArrowRight, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { useWeb3 } from "../context/useWeb3";
import { ethers } from "ethers";

// DeBridge ERC20 ABI (minimal for approvals)
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)"
];

// Chain configurations
const CHAINS = {
  "8453": {
    name: "Base",
    icon: "https://assets.coingecko.com/coins/images/26416/standard/base-icon.png",
    rpcUrl: "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
    deBridgeGateway: "0x22B6B75C92c882fBA7148C9F4064a915e213f802"
  },
  "1": {
    name: "Ethereum",
    icon: "https://assets.coingecko.com/coins/images/279/standard/ethereum.png",
    rpcUrl: "https://mainnet.infura.io/v3/your-infura-key",
    explorerUrl: "https://etherscan.io",
    deBridgeGateway: "0x22B6B75C92c882fBA7148C9F4064a915e213f802"
  },
  "137": {
    name: "Polygon",
    icon: "https://assets.coingecko.com/coins/images/4713/standard/polygon.png",
    rpcUrl: "https://polygon-rpc.com",
    explorerUrl: "https://polygonscan.com",
    deBridgeGateway: "0x22B6B75C92c882fBA7148C9F4064a915e213f802"
  },
  "42161": {
    name: "Arbitrum",
    icon: "https://assets.coingecko.com/coins/images/16547/standard/photo_2023-03-29_21.07.25.jpeg",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorerUrl: "https://arbiscan.io",
    deBridgeGateway: "0x22B6B75C92c882fBA7148C9F4064a915e213f802"
  },
  "10": {
    name: "Optimism",
    icon: "https://assets.coingecko.com/coins/images/25244/standard/Optimism.png",
    rpcUrl: "https://mainnet.optimism.io",
    explorerUrl: "https://optimistic.etherscan.io",
    deBridgeGateway: "0x22B6B75C92c882fBA7148C9F4064a915e213f802"
  }
};

export default function TokenBridgeSection({ employeeTokenInfo }) {
  const { provider, signer, account, chainId } = useWeb3();
  
  const [sourceChainId, setSourceChainId] = useState(chainId || "8453");
  const [targetChainId, setTargetChainId] = useState("1");
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [txStatus, setTxStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  
  // Fetch token list for the source chain
  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoadingTokens(true);
      try {
        const response = await axios.get(`https://deswap.debridge.finance/v1.0/token-list?chainId=${sourceChainId}`);
        console.log("Token list API response:", response.data);
        
        // Process the token data based on the API response structure
        let tokenList = [];
        
        // Handle the specific structure we now know (tokens is an object with token addresses as keys)
        if (response.data && response.data.tokens && typeof response.data.tokens === 'object') {
          // Convert object of tokens to array
          tokenList = Object.values(response.data.tokens);
        } else if (Array.isArray(response.data)) {
          tokenList = response.data;
        }
        
        console.log("Processed token list:", tokenList);
        setTokens(tokenList);
        // Set default selected token (prefer USDC or similar stable)
        const preferredToken = tokenList.find(t => 
          t.symbol === "USDC" || t.symbol === "USDT" || t.symbol === "DAI"
        ) || tokenList[0];
        
        setSelectedToken(preferredToken);
        
        // Add some default tokens in case the API fails or returns empty
        if (tokenList.length === 0) {
          tokenList = [
            { 
              address: "0x4200000000000000000000000000000000000006", 
              symbol: "WETH", 
              name: "Wrapped Ether",
              decimals: 18
            },
            {
              address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", 
              symbol: "USDC", 
              name: "USD Coin",
              decimals: 6
            },
            {
              address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", 
              symbol: "DAI", 
              name: "Dai Stablecoin",
              decimals: 18
            }
          ];
        }
        
        console.log("Processed token list:", tokenList);
        setTokens(tokenList);
        
        // Set default selected token (prefer USDC or similar stable)
        const defaultToken = tokenList.find(t => 
          t.symbol === "USDC" || t.symbol === "USDT" || t.symbol === "DAI"
        ) || tokenList[0];
        
        setSelectedToken(defaultToken);
        setIsLoadingTokens(false);
      } catch (error) {
        console.error("Error fetching token list:", error);
        // Fallback to default tokens
        const defaultTokens = [
          { 
            address: "0x4200000000000000000000000000000000000006", 
            symbol: "WETH", 
            name: "Wrapped Ether",
            decimals: 18
          },
          {
            address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", 
            symbol: "USDC", 
            name: "USD Coin",
            decimals: 6
          },
          {
            address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", 
            symbol: "DAI", 
            name: "Dai Stablecoin",
            decimals: 18
          }
        ];
        setTokens(defaultTokens);
        setSelectedToken(defaultTokens[0]);
        setIsLoadingTokens(false);
      }
    };
    
    if (sourceChainId) {
      fetchTokens();
    }
  }, [sourceChainId]);
  
  // Check approval status when token/amount changes
  useEffect(() => {
    const checkApproval = async () => {
      if (!signer || !selectedToken || !amount || parseFloat(amount) <= 0) {
        setIsApproved(false);
        return;
      }
      
      try {
        const tokenContract = new ethers.Contract(selectedToken.address, ERC20_ABI, signer);
        const deBridgeGateway = CHAINS[sourceChainId].deBridgeGateway;
        const allowance = await tokenContract.allowance(account, deBridgeGateway);
        const amountWei = ethers.utils.parseUnits(amount, selectedToken.decimals);
        
        setIsApproved(allowance.gte(amountWei));
      } catch (error) {
        console.error("Error checking approval:", error);
        setIsApproved(false);
      }
    };
    
    checkApproval();
  }, [signer, selectedToken, amount, account, sourceChainId]);
  
  // Fetch token price
  const [tokenPrice, setTokenPrice] = useState(null);
  useEffect(() => {
    const fetchTokenPrice = async () => {
      if (!selectedToken) return;
      
      try {
        const response = await axios.get(`https://public-api.birdeye.so/defi/price?address=${selectedToken.address}`, {
          headers: {
            'X-API-KEY': '68f835271a3b4d33933a20bb20d1cae3'
          }
        });
        if (response.data && response.data.data && response.data.data.value) {
          console.log("Token price response:", response.data);
          setTokenPrice(response.data.data.value);
        }
      } catch (error) {
        console.error("Error fetching token price:", error);
      }
    };
    
    fetchTokenPrice();
  }, [selectedToken]);
  
  // Check transaction status
  useEffect(() => {
    const checkOrderStatus = async () => {
      if (!orderId) return;
      
      try {
        const response = await axios.get(`https://stats-api.dln.trade/api/Orders/${orderId}`);
        setOrderStatus(response.data);
        
        // If order is still processing, poll every 15 seconds
        if (
          response.data.status !== "executed" && 
          response.data.status !== "failed" &&
          response.data.status !== "cancelled"
        ) {
          setTimeout(() => checkOrderStatus(), 15000);
        }
      } catch (error) {
        console.error("Error checking order status:", error);
      }
    };
    
    checkOrderStatus();
  }, [orderId]);
  
  // Handle token approval
  const handleApprove = async () => {
    if (!signer || !selectedToken) return;
    
    try {
      setIsLoading(true);
      const tokenContract = new ethers.Contract(selectedToken.address, ERC20_ABI, signer);
      const deBridgeGateway = CHAINS[sourceChainId].deBridgeGateway;
      const amountWei = ethers.utils.parseUnits(amount, selectedToken.decimals);
      
      // Approve max possible amount
      const tx = await tokenContract.approve(
        deBridgeGateway,
        ethers.constants.MaxUint256
      );
      
      setTxStatus({
        type: "approval",
        hash: tx.hash,
        status: "pending"
      });
      
      await tx.wait();
      setIsApproved(true);
      setTxStatus({
        type: "approval",
        hash: tx.hash,
        status: "success"
      });
    } catch (error) {
      console.error("Error approving token:", error);
      setTxStatus({
        type: "approval",
        status: "error",
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle bridge transaction
  const handleBridge = async () => {
    if (!signer || !selectedToken || !amount || !isApproved) return;
    
    try {
      setIsLoading(true);
      
      // Step 1: Request order creation transaction details from deBridge API
      const orderCreationRequest = {
        srcChainId: parseInt(sourceChainId),
        srcChainTokenIn: selectedToken.address,
        srcChainTokenInAmount: ethers.utils.parseUnits(amount, selectedToken.decimals).toString(),
        dstChainId: parseInt(targetChainId),
        dstChainTokenOut: selectedToken.address,
        dstChainTokenOutRecipient: account,
      };
      
      const orderCreationResponse = await axios.post(
        "https://deswap.debridge.finance/v1.0/dln/order/create-tx",
        orderCreationRequest
      );
      
      // Step 2: Submit the transaction
      const tx = await signer.sendTransaction({
        to: orderCreationResponse.data.tx.to,
        data: orderCreationResponse.data.tx.data,
        value: ethers.BigNumber.from(orderCreationResponse.data.tx.value || "0")
      });
      
      setTxStatus({
        type: "bridge",
        hash: tx.hash,
        status: "pending"
      });
      
      await tx.wait();
      
      // Set order ID for tracking
      setOrderId(orderCreationResponse.data.orderId);
      
      setTxStatus({
        type: "bridge",
        hash: tx.hash,
        status: "success"
      });
    } catch (error) {
      console.error("Error bridging token:", error);
      setTxStatus({
        type: "bridge",
        status: "error",
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Swap source and target chains
  const handleSwapChains = () => {
    const temp = sourceChainId;
    setSourceChainId(targetChainId);
    setTargetChainId(temp);
  };
  
  // Get token balance
  const [tokenBalance, setTokenBalance] = useState("0");
  useEffect(() => {
    const fetchBalance = async () => {
      if (!signer || !selectedToken || !account) return;
      
      try {
        const tokenContract = new ethers.Contract(selectedToken.address, ERC20_ABI, signer);
        const balance = await tokenContract.balanceOf(account);
        setTokenBalance(ethers.utils.formatUnits(balance, selectedToken.decimals));
      } catch (error) {
        console.error("Error fetching token balance:", error);
      }
    };
    
    fetchBalance();
  }, [signer, selectedToken, account]);
  
  // Format token amount with proper decimals
  const formatTokenAmount = (amount, decimals = 4) => {
    if (!amount) return "0";
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return "0";
    return parsed.toFixed(decimals);
  };
  
  return (
    <div className="bg-crypto-card rounded-xl p-6 border border-gray-800 space-y-6 min-w-full">
      <h2 className="text-xl font-bold flex items-center">
        <span className="mr-2">🌉</span> Bridge Your Tokens
      </h2>
      
      {/* Chain Selection */}
      <div className="flex items-center space-x-2">
        <div className="w-1/2">
          <label className="block text-sm text-gray-400 mb-2">From Chain</label>
          <div className="relative">
            <select 
              className="w-full p-3 pl-10 rounded-lg bg-crypto-dark border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={sourceChainId}
              onChange={(e) => setSourceChainId(e.target.value)}
            >
              {Object.entries(CHAINS).map(([id, chain]) => (
                <option key={id} value={id}>{chain.name}</option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <img 
                src={CHAINS[sourceChainId]?.icon || ""}
                alt={CHAINS[sourceChainId]?.name || "Chain"}
                className="w-5 h-5 rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleSwapChains} 
          className="p-2 rounded-full bg-crypto-dark border border-gray-800 hover:bg-gray-800 transition-colors mt-4"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <div className="w-1/2">
          <label className="block text-sm text-gray-400 mb-2">To Chain</label>
          <div className="relative">
            <select 
              className="w-full p-3 pl-10 rounded-lg bg-crypto-dark border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={targetChainId}
              onChange={(e) => setTargetChainId(e.target.value)}
            >
              {Object.entries(CHAINS).map(([id, chain]) => (
                <option key={id} value={id} disabled={id === sourceChainId}>
                  {chain.name}
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <img 
                src={CHAINS[targetChainId]?.icon || ""}
                alt={CHAINS[targetChainId]?.name || "Chain"}
                className="w-5 h-5 rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Token Selection */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Token</label>
        <div className="relative">
          <select 
            className="w-full p-3 pl-10 rounded-lg bg-crypto-dark border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={selectedToken?.address || ""}
            onChange={(e) => {
              const token = tokens.find(t => t.address === e.target.value);
              setSelectedToken(token);
            }}
            disabled={isLoadingTokens}
          >
            {isLoadingTokens ? (
              <option value="">Loading tokens...</option>
            ) : tokens && tokens.length > 0 ? (
              tokens.map((token, index) => (
                <option key={token.address || `token-${index}`} value={token.address}>
                  {token.symbol} - {token.name}
                </option>
              ))
            ) : (
              <option value="">No tokens available</option>
            )}
          </select>
          
          {selectedToken && selectedToken.logoURI && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <img 
                src={selectedToken.logoURI} 
                alt={selectedToken.symbol} 
                className="w-5 h-5 rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjRDMTguNjI3NCAyNCAyNCAxOC42Mjc0IDI0IDEyQzI0IDUuMzcyNTggMTguNjI3NCAwIDEyIDBDNS4zNzI1OCAwIDAgNS4zNzI1OCAwIDEyQzAgMTguNjI3NCA1LjM3MjU4IDI0IDEyIDI0WiIgZmlsbD0iIzYzNjc3MCIvPjxwYXRoIGQ9Ik0xNy43NzkgMTQuOTc3NkMxNy43NzkgMTcuMDYxNCAxNi4wODY0IDE4Ljc1NCAxNC4wMDI2IDE4Ljc1NEg3LjY2MDRWNi4zNzg2MUgxMy4wNDVDMTUuMTI4OCA2LjM3ODYxIDE2LjgyMTQgOC4wNzEyMiAxNi44MjE0IDEwLjE1NUM2LjgyMTQgMTAuNzYxOCAxNi4zMjU2IDExLjMxODUgMTUuNTAwMyAxMS41NDVDMTY3MDIgMTIuNTg2NCAxNy43NzkgMTMuNTk2MyAxNy43NzkgMTQuOTc3NloiIGZpbGw9IndoaXRlIi8+PHBhdGggZD0iTTE0LjAwMjYgMTIuNzY2SDEwLjIyNlYxNS43MjU0SDEzLjc3NjJDMTQuNDMzNyAxNS43MjU0IDE0Ljk2MjggMTUuMTk2MiAxNC45NjI4IDE0LjUzODdDMTQuOTYyOCAxMy44MTgzIDE0LjU0NjUgMTMuNDU2NCAxNC4wMDI2IDEyLjc2NloiIGZpbGw9IiM2MzY3NzAiLz48cGF0aCBkPSJNMTMuMDQ0OSA5LjQwNzIzSDEwLjIyNTlWMTIuMDQ1NkgxMy4wNDQ5QzEzLjcwMjQgMTIuMDQ1NiAxNC4yMzE2IDExLjUxNjQgMTQuMjMxNiAxMC44NTg5QzE0LjIzMTYgMTAuMjAxNCAxMy43MDI0IDkuNDA3MjMgMTMuMDQ0OSA5LjQwNzIzWiIgZmlsbD0iIzYzNjc3MCIvPjwvc3ZnPg==";
                }}
              />
            </div>
          )}
        </div>
        
        {tokenBalance && (
          <div className="text-sm text-gray-400 mt-1">
            Balance: {formatTokenAmount(tokenBalance)} {selectedToken?.symbol}
            {tokenPrice && (
              <span className="ml-1">
                (${formatTokenAmount(parseFloat(tokenBalance) * tokenPrice, 2)})
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Amount Input */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Amount</label>
        <div className="relative">
          <input 
            type="text"
            className="w-full p-3 rounded-lg bg-crypto-dark border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-indigo-900 hover:bg-indigo-800 transition-colors px-2 py-1 rounded-md"
            onClick={() => setAmount(tokenBalance)}
          >
            MAX
          </button>
        </div>
        
        {tokenPrice && amount && (
          <div className="text-sm text-gray-400 mt-1">
            Value: ${(parseFloat(amount || 0) * tokenPrice).toFixed(2)}
          </div>
        )}
      </div>
      
      {/* Transaction Status */}
      {txStatus && (
        <div className={`p-3 rounded-lg ${
          txStatus.status === "error" ? "bg-red-900/20 border border-red-800" : 
          txStatus.status === "success" ? "bg-green-900/20 border border-green-800" : 
          "bg-indigo-900/20 border border-indigo-800"
        }`}>
          <div className="flex items-center">
            {txStatus.status === "pending" && <RefreshCw className="w-5 h-5 mr-2 animate-spin" />}
            {txStatus.status === "success" && <CheckCircle className="w-5 h-5 mr-2 text-green-500" />}
            {txStatus.status === "error" && <XCircle className="w-5 h-5 mr-2 text-red-500" />}
            
            <div>
              {txStatus.type === "approval" ? "Token Approval" : "Bridge Transaction"} 
              {txStatus.status === "pending" ? " in progress..." : 
               txStatus.status === "success" ? " successful!" : 
               " failed!"}
            </div>
          </div>
          
          {txStatus.hash && (
            <a 
              href={`${CHAINS[sourceChainId].explorerUrl}/tx/${txStatus.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors mt-1 block"
            >
              View transaction ↗
            </a>
          )}
          
          {txStatus.status === "error" && txStatus.message && (
            <div className="text-sm text-red-400 mt-1">
              Error: {txStatus.message.slice(0, 100)}
              {txStatus.message.length > 100 ? "..." : ""}
            </div>
          )}
        </div>
      )}
      
      {/* Order Status */}
      {orderStatus && (
        <div className={`p-3 rounded-lg ${
          orderStatus.status === "failed" || orderStatus.status === "cancelled" ? "bg-red-900/20 border border-red-800" : 
          orderStatus.status === "executed" ? "bg-green-900/20 border border-green-800" : 
          "bg-indigo-900/20 border border-indigo-800"
        }`}>
          <div className="flex items-center">
            {(orderStatus.status === "pending" || orderStatus.status === "created") && 
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />}
            {orderStatus.status === "executed" && <CheckCircle className="w-5 h-5 mr-2 text-green-500" />}
            {(orderStatus.status === "failed" || orderStatus.status === "cancelled") && 
              <XCircle className="w-5 h-5 mr-2 text-red-500" />}
            
            <div className="capitalize">
              Bridge Order: {orderStatus.status}
            </div>
          </div>
          
          {orderStatus.targetTxHash && (
            <a 
              href={`${CHAINS[targetChainId].explorerUrl}/tx/${orderStatus.targetTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors mt-1 block"
            >
              View destination transaction ↗
            </a>
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex space-x-4">
        {!isApproved ? (
          <button
            onClick={handleApprove}
            disabled={isLoading || !selectedToken || !amount || parseFloat(amount) <= 0}
            className={`w-full py-3 rounded-lg font-bold text-white 
            ${isLoading ? 'bg-indigo-900/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} 
            transition-colors`}
          >
            {isLoading && txStatus?.type === "approval" ? (
              <span className="flex items-center justify-center">
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Approving...
              </span>
            ) : (
              `Approve ${selectedToken?.symbol || 'Token'}`
            )}
          </button>
        ) : (
          <button
            onClick={handleBridge}
            disabled={isLoading || !selectedToken || !amount || parseFloat(amount) <= 0}
            className={`w-full py-3 rounded-lg font-bold text-white 
            ${isLoading ? 'bg-indigo-900/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} 
            transition-colors`}
          >
            {isLoading && txStatus?.type === "bridge" ? (
              <span className="flex items-center justify-center">
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Bridging...
              </span>
            ) : (
              `Bridge ${amount || '0'} ${selectedToken?.symbol || 'Token'}`
            )}
          </button>
        )}
      </div>
      
      {/* Bridging Info */}
      <div className="text-sm text-gray-400 mt-4">
        <p>Powered by deBridge DLN (Decentralized Liquidity Network)</p>
        <p className="mt-1">Est. time: 2-5 minutes</p>
      </div>
    </div>
  );
}