export const CHAINS = [
    {
        name: "Polygon Mainnet",
        chainId: 137,
        rpcUrl: "https://polygon-rpc.com",
        contractAddress: "0xYourContractAddressOnPolygonMainnet",
        tokens: [
            { symbol: "MATIC", address: "0x0000000000000000000000000000000000001010" },
            { symbol: "USDT", address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },
            { symbol: "USDC", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", decimals: 6 },
        ],
        blockExplorerUrl: "https://polygonscan.com"
    },
    {
        name: "Polygon Amoy Testnet",
        chainId: 80002,
        rpcUrl: "https://rpc-amoy.polygon.technology",
        contractAddress: "0xYourContractAddressOnPolygonTestnet",
        tokens: [
            { symbol: "MATIC", address: "0x0000000000000000000000000000000000001010" },
            { symbol: "TUSDT", address: "0x2655783ed6c47Fd312D1204712A804821899E1A3", decimals: 6 },
            { symbol: "USDC", address: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582", decimals: 6 },
        ],
        blockExplorerUrl: "https://amoy.polygonscan.com/"
    },
    {
        name: "BNB Chain Mainnet",
        chainId: 56,
        rpcUrl: "https://bsc-dataseed.bnbchain.org",
        contractAddress: "0xYourContractAddressOnBNBMainnet",
        tokens: [
            { symbol: "BNB", address: "0x0000000000000000000000000000000000000000" },
            { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 6 },
            { symbol: "USDC", address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: 6 },
        ],
        blockExplorerUrl: "https://bscscan.com"
    },
    {
        name: "BNB Chain Testnet",
        chainId: 97,
        rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
        contractAddress: "0x2c137aC6Bc804A9F798053347802F489F0025768",
        tokens: [
            { symbol: "BNB", address: "0x0000000000000000000000000000000000000000" },
            { symbol: "USDT", address: "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd", decimals: 18 },
            { symbol: "USDC", address: "0x0a385f86059e0b2a048171d78afd1f38558121f3", decimals: 18 },
        ],
        blockExplorerUrl: "https://testnet.bscscan.com"
    },
    {
        name: "Educhain Mainnet",
        chainId: 41923,
        rpcUrl: "https://rpc.edu-chain.raas.gelato.cloud/66a13f09ceab49998f954e7bb71c7c02",
        contractAddress: "0xYourContractAddressOnEduchainMainnet",
        tokens: [
            { symbol: "EDU", address: "0xf263292e14d9d8ecd55b58dad1f1df825a874b7c" },
            { symbol: "USDT", address: "0x7277Cc818e3F3FfBb169c6Da9CC77Fc2d2a34895", decimals: 6 },
            { symbol: "USDC", address: "0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342", decimals: 6 },
        ],
        blockExplorerUrl: "https://educhain.blockscout.com"
    },
    {
        name: "Educhain Testnet",
        chainId: 656476,
        rpcUrl: "https://rpc.open-campus-codex.gelato.digital",
        contractAddress: "0xYourContractAddressOnEduchainTestnet",
        tokens: [
            { symbol: "EDU", address: "0x6b175474e89094c44da98b954eedeac495271d0f" },
            { symbol: "USDT", address: "0xBCe9628e89eC686C9E1878065bec04b45DBD0B40", decimals: 6 },
            { symbol: "USDC", address: "0x77721D19BDfc67fe8cc46ddaa3cc4C94e6826E3C", decimals: 6 },
        ],
        blockExplorerUrl: "https://edu-chain-testnet.blockscout.com"
    },
    {
        name: "Sonic Blaze Testnet",
        chainId: 57054,
        rpcUrl: "https://rpc.blaze.soniclabs.com",
        contractAddress: "0x60F733b4F6eCa0Cf196397C7b9f805f36AEc9E27",
        tokens: [
            { symbol: "S", address: "0x0000000000000000000000000000000000000000" }
        ],
        blockExplorerUrl: "https://testnet.sonicscan.org"
    }
];


