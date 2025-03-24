import React, { useEffect, useState } from "react";
import { Wallet, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  executeBulkTransfer,
  getName,
  getSymbol,
  getTotalCoins,
} from "../../blockchain/scripts/Token";
import { useWeb3 } from "../../context/useWeb3";
import { ethers, formatEther, formatUnits } from "ethers";
import { verifyToken } from "../../utils/jwt";

// Token ABI for balance fetching
const tokenAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

export default function BalanceSection({ isWalletConnected }) {
  const { provider, signer, account, selectedChain, selectedToken } = useWeb3();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenBalances, setTokenBalances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const contractAddress = verifyToken(
    localStorage.getItem("token")
  )?.contractAddress;

  const getTokenInfo = async () => {
    if (provider && contractAddress) {
      try {
        const coins = await getTotalCoins(provider, contractAddress);
        const name = await getName(provider, contractAddress);
        const symbol = await getSymbol(provider, contractAddress);

        setTokenBalance(formatEther(BigInt(coins)));
        setTokenName(name);
        setTokenSymbol(symbol);
      } catch (error) {
        console.error("Error fetching token info:", error);
      }
    }
  };

  const fetchTokenBalances = async () => {
    if (!provider || !account || !selectedChain) return;
    
    setIsLoading(true);
    
    try {
      const balances = [];
      
      // Fetch native token balance (ETH, BNB, etc.)
      const nativeToken = selectedChain.tokens.find(t => 
        t.address === "0x0000000000000000000000000000000000000000");
      
      if (nativeToken) {
        const nativeBalance = await provider.getBalance(account);
        const formatted = formatEther(nativeBalance);
        
        balances.push({
          currency: nativeToken.symbol,
          address: nativeToken.address,
          amount: formatted,
          value: `$${(parseFloat(formatted) * (nativeToken.price || 0)).toFixed(2)}`,
          change: "+0.0%", // Would need price API for real changes
          isPositive: true,
          decimals: 18
        });
      }
      
      // Fetch ERC20 token balances
      const erc20Tokens = selectedChain.tokens.filter(t => 
        t.address !== "0x0000000000000000000000000000000000000000");
      
      for (const token of erc20Tokens) {
        try {
          const tokenContract = new ethers.Contract(token.address, tokenAbi, provider);
          const balance = await tokenContract.balanceOf(account);
          const decimals = await tokenContract.decimals().catch(() => 18);
          const formatted = formatUnits(balance, decimals);
          
          balances.push({
            currency: token.symbol,
            address: token.address,
            amount: formatted,
            value: `$${(parseFloat(formatted) * (token.price || 0)).toFixed(2)}`,
            change: "+0.0%", // Would need price API for real changes
            isPositive: true,
            decimals
          });
        } catch (error) {
          console.error(`Error fetching balance for ${token.symbol}:`, error);
        }
      }
      
      setTokenBalances(balances);
    } catch (error) {
      console.error("Error fetching token balances:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [showAddFunds, setShowAddFunds] = useState(false);

  useEffect(() => {
    getTokenInfo();
  }, [provider, contractAddress]);

  useEffect(() => {
    fetchTokenBalances();
  }, [provider, account, selectedChain]);

  return (
    <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 h-[420px] overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
            Token Balance
          </h2>
          <p className="text-gray-400 text-sm mt-1">Your token details</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm mt-1">
            Token Name: {tokenName.toUpperCase()}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Token Symbol: {tokenSymbol}
          </p>
        </div>
      </div>

      <div className="bg-crypto-dark/50 rounded-xl p-6 mb-6 border border-gray-800 group-hover:border-indigo-500/20 group-hover:bg-crypto-dark/70 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400">Total Coins</span>
          <span className="text-green-400 text-sm">Current Chain: {selectedChain?.name}</span>
        </div>
        <div className="text-3xl font-bold group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
          {tokenBalance}
        </div>
      </div>

      <div
        className="space-y-4 overflow-y-auto custom-scrollbar pr-2"
        style={{ maxHeight: "180px" }}
      >
        {isLoading ? (
          <div className="text-center py-4 text-gray-400">Loading token balances...</div>
        ) : tokenBalances.length === 0 ? (
          <div className="text-center py-4 text-gray-400">No token balances found</div>
        ) : (
          tokenBalances.map((token, index) => (
            <motion.div
              key={token.address}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group/item bg-crypto-dark/50 rounded-xl p-4 border border-gray-800 hover:border-indigo-500/50 transition-all hover:bg-crypto-dark/70"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center transform transition-transform group-hover/item:scale-110">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold group-hover/item:text-white transition-colors">
                      {token.currency}
                    </div>
                    <div className="text-sm text-gray-400">
                      {parseFloat(token.amount).toFixed(4)} {token.currency}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold group-hover/item:text-white transition-colors">
                    {token.value}
                  </div>
                  <div
                    className={`text-sm flex items-center ${
                      token.isPositive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {token.isPositive ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {token.change}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Funds Modal (unchanged) */}
      <AnimatePresence>
        {showAddFunds && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowAddFunds(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-crypto-card p-6 rounded-2xl border border-gray-800 w-full max-w-md m-4 hover:border-indigo-500/50 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Add Funds</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Select Currency
                  </label>
                  <select className="w-full bg-crypto-dark border border-gray-800 rounded-xl p-3 text-white focus:border-indigo-500 transition-colors">
                    {tokenBalances.map(token => (
                      <option key={token.address} value={token.currency}>
                        {token.currency}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-crypto-dark border border-gray-800 rounded-xl p-3 text-white focus:border-indigo-500 transition-colors"
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
                  Proceed to Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
