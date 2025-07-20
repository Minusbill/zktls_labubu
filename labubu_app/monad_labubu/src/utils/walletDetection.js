export async function waitForWallet(timeout = 5000) {
    return new Promise((resolve) => {
        let isResolved = false;

        const checkWallet = () => {
            if (window.ethereum) {
                let walletType = null;
                if (window.ethereum.isMetaMask) {
                    walletType = 'MetaMask';
                } else if (window.ethereum.isOKX) {
                    walletType = 'OKX';
                }
                isResolved = true;
                resolve({ isAvailable: !!walletType, walletType });
            } else if (!isResolved) {
                resolve({ isAvailable: false, walletType: null });
            }
        };

        checkWallet();

        setTimeout(() => {
            if (!isResolved) {
                checkWallet();
            }
        }, timeout);
    });
}