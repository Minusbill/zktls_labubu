export const monadTestnet = {
    id: 10143,
    name: 'Monad Testnet',
    network: 'monad-testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'MON',
        symbol: 'MON',
    },
    rpcUrls: {
        default: { http: ['https://testnet-rpc.monad.xyz'] },
        public: { http: ['https://testnet-rpc.monad.xyz'] },
    },
    blockExplorers: {
        default: {
            name: 'Monad Explorer',
            url: 'https://testnet.monadexplorer.com',
        },
    },
    testnet: true,
};

export const DEFAULT_CONFIG = {
    CONTRACT_ADDRESS: "0x19361b975a65d93abf0eda3c89a87f1b5f42b1e9",
    NETWORK: {
        name: "Monad Testnet",
        chainId: 10143,
        rpcUrl: "https://testnet-rpc.monad.xyz",
        blockExplorer: "https://testnet.monadexplorer.com"
    },
    NFT: {
        maxId: 5,
        totalSupply: 1000
    }
};

export function getConfig() {
    const customContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || localStorage.getItem('contract_address');
    return {
        ...DEFAULT_CONFIG,
        CONTRACT_ADDRESS: customContractAddress || DEFAULT_CONFIG.CONTRACT_ADDRESS
    };
}

export function setContractAddress(address) {
    localStorage.setItem('contract_address', address);
    console.log('合约地址已更新:', address);
}

export function isValidContractAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function switchToMonadTestnet() {
    if (!window.ethereum) {
        console.error('未检测到以太坊钱包');
        return false;
    }

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${DEFAULT_CONFIG.NETWORK.chainId.toString(16)}` }],
        });
        console.log('✅ 已切换到 Monad 测试网');
        return true;
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: `0x${DEFAULT_CONFIG.NETWORK.chainId.toString(16)}`,
                            chainName: DEFAULT_CONFIG.NETWORK.name,
                            rpcUrls: [DEFAULT_CONFIG.NETWORK.rpcUrl],
                            nativeCurrency: {
                                name: 'MON',
                                symbol: 'MON',
                                decimals: 18,
                            },
                            blockExplorerUrls: [DEFAULT_CONFIG.NETWORK.blockExplorer],
                        },
                    ],
                });
                console.log('✅ 已添加并切换到 Monad 测试网');
                return true;
            } catch (addError) {
                console.error('添加 Monad 测试网失败:', addError);
                return false;
            }
        }
        console.error('切换到 Monad 测试网失败:', switchError);
        return false;
    }
}

export const config = getConfig();