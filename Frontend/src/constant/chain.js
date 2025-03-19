export const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

export const CHAINS = [
    {
        name: "Polygon Mainnet",
        chainId: 137,
        rpcUrl: "https://polygon-rpc.com",
        contractAddress: "0xYourContractAddressOnPolygonMainnet",
        tokens: [
            { symbol: "MATIC", address: "0x0000000000000000000000000000000000001010", decimals: 18 },
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
            { symbol: "MATIC", address: "0x0000000000000000000000000000000000001010", decimals: 18 },
            { symbol: "TUSDT", address: "0x2655783ed6c47Fd312D1204712A804821899E1A3", decimals: 6 },
            { symbol: "USDC", address: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582", decimals: 6 },
        ],
        blockExplorerUrl: "https://amoy.polygonscan.com/"
    },
    {
        name: "BNB Chain Mainnet",
        chainId: 56,
        rpcUrl: "https://binance.llamarpc.com",
        contractAddress: "0xYourContractAddressOnBNBMainnet",
        tokens: [
            { symbol: "BNB", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
            { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 6 },
            { symbol: "USDC", address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: 6 },
        ],
        blockExplorerUrl: "https://bscscan.com"
    },
    {
        name: "BNB Chain Testnet",
        chainId: 97,
        rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
        contractAddress: "0x9571BcCA765f30FF221dfB976ab530Ba44bd85AE",
        tokens: [
            { symbol: "tBNB", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
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
            { symbol: "EDU", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
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
            { symbol: "EDU", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
            { symbol: "USDT", address: "0x3BfB66999C22c0189B0D837D12D5A4004844EC12", decimals: 6 },
            { symbol: "USDC", address: "0x77721D19BDfc67fe8cc46ddaa3cc4C94e6826E3C", decimals: 6 },
            { symbol: "USDC CIRCLE", address: "0x19EeaDcBA1801Afec43e87Cefcd4239E13fc294d", decimals: 6 },
        ],
        blockExplorerUrl: "https://edu-chain-testnet.blockscout.com"
    },
    {
        name: "Sonic Blaze Testnet",
        chainId: 57054,
        rpcUrl: "https://rpc.blaze.soniclabs.com",
        contractAddress: "0x072dD1BAb49819726C61Bca8F5774565f5c8BF24",
        tokens: [
            { symbol: "S", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
            { symbol: "CORAL", address: "0xAF93888cbD250300470A1618206e036E11470149", decimals: 18 },
        ],
        blockExplorerUrl: "https://testnet.sonicscan.org"
    }
];


