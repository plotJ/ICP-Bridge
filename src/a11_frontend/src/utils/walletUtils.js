export async function requestAccount(setWalletAddress) {
    if (window.ethereum) {
        // console.log('Ethereum provider found');
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });
            setWalletAddress(accounts[0]);
        } catch (error) {
            console.error('Error requesting accounts:', error);
        }
    } else {
        // console.log('Ethereum provider not found.');
    }
}

export function handleLogout(setWalletAddress) {
    setWalletAddress("");
}

export function truncateAddress(address) {
    if (address.length > 12) {
        return `${address.slice(0, 8)}...${address.slice(-4)}`;
    }
    return address;
}

export const getCurrentNetwork = async () => {
    try {
        if (window.ethereum) {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });

            switch (chainId) {
                case '0xaa36a7': // Ethereum Sepolia Testnet
                    return 'sepolia';
                case '0x14a34': // Base Sepolia Testnet
                    return 'base-sepolia';
                default:
                    return 'unknown';
            }
        } else {
            throw new Error("Ethereum object not found");
        }
    } catch (error) {
        console.error("Error detecting network:", error);
        return 'unknown';
    }
}

export const switchNetwork = async (chainId) => {
    if (window.ethereum) {
      try {
        // Try to switch to the network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainId }],
        });
        return true;
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            const networkParams = getNetworkParams(chainId);
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [networkParams],
            });
            return true;
          } catch (addError) {
            console.error('Error adding network:', addError);
            return false;
          }
        }
        console.error('Error switching network:', switchError);
        return false;
      }
    } else {
      console.error('Ethereum object not found');
      return false;
    }
  };
  
  const getNetworkParams = (chainId) => {
    switch (chainId) {
        case '0xaa36a7': // Ethereum Sepolia
            return {
                chainId: '0xaa36a7',
                chainName: 'Sepolia test network',
                nativeCurrency: {
                    name: 'SepoliaETH',
                    symbol: 'SepoliaETH',
                    decimals: 18
                },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
            };
        case '0x14a34': // Base Sepolia
            return {
                chainId: '0x14a34',
                chainName: 'Base Sepolia Testnet',
                nativeCurrency: {
                    name: 'Ether',
                    symbol: 'ETH',
                    decimals: 18
                },
                rpcUrls: ['https://sepolia.base.org'],
                blockExplorerUrls: ['https://sepolia.basescan.org']
            };
        default:
            throw new Error('Unsupported network');
    }
};