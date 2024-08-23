import React, { useState, useEffect } from "react";
import { HiSwitchVertical } from "react-icons/hi";
import { requestAccount, getCurrentNetwork, switchNetwork } from '../utils/walletUtils';
import { fetchBalances } from '../utils/balanceUtils';
import NotificationModal from './NotificationModal';

export default function BridgeDialog({ walletAddress, setWalletAddress }) {
    const [fromChain, setFromChain] = useState("Ethereum Sepolia");
    const [toChain, setToChain] = useState("Base Sepolia");
    const [fromImg, setFromImg] = useState("/Crypto/eth.png");
    const [toImg, setToImg] = useState("/Crypto/base.png");
    const [amount, setAmount] = useState("");
    const [sepoliaBalance, setSepoliaBalance] = useState("0");
    const [baseSepoliaBalance, setBaseSepoliaBalance] = useState("0");
    const [notificationState, setNotificationState] = useState({
        isOpen: false,
        status: '',
        txHash: '',
    });

    useEffect(() => {
        if (walletAddress) {
            syncChainWithNetwork().then(() => {
                updateBalances();
            });
        } else {
            setSepoliaBalance("0");
            setBaseSepoliaBalance("0");
            setAmount("");
        }
    }, [walletAddress, fromChain]);

    const syncChainWithNetwork = async () => {
        const network = await getCurrentNetwork();
      
        if (fromChain === "Ethereum Sepolia" && network !== 'sepolia') {
          const switched = await switchNetwork('0xaa36a7'); // Ethereum Sepolia chainId
          if (switched) {
            setFromChain("Ethereum Sepolia");
            setFromImg("/Crypto/eth.png");
          }
        } else if (fromChain === "Base Sepolia" && network !== 'base-sepolia') {
          const switched = await switchNetwork('0x14a34'); // Base Sepolia chainId
          if (switched) {
            setFromChain("Base Sepolia");
            setFromImg("/Crypto/base.png");
          }
        }
      };

    const updateBalances = async () => {
        const balances = await fetchBalances(walletAddress);
        setSepoliaBalance(balances.sepoliaBalance);
        setBaseSepoliaBalance(balances.baseSepoliaBalance);
    };

    const handleSwitch = () => {
        const temp = fromChain;
        setFromChain(toChain);
        setToChain(temp);

        const tempImg = fromImg;
        setFromImg(toImg);
        setToImg(tempImg);
    };

    const handleMax = () => {
        if (walletAddress) {
            if (fromChain === "Ethereum Sepolia") {
                setAmount(sepoliaBalance);
            } else {
                setAmount(baseSepoliaBalance);
            }
        } else {
            setAmount("0");
        }
    };

    const getCurrentBalance = () => {
        if (!walletAddress) return "0";
        return fromChain === "Ethereum Sepolia" ? sepoliaBalance : baseSepoliaBalance;
    };

    const handleBridge = async () => {
        if (!walletAddress) {
            alert("Please connect your wallet first.");
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 200));

            if (Math.random() > 0.5) {
                throw new Error("Transaction failed");
            }

            setNotificationState({
                isOpen: true,
                status: 'success',
                txHash: '0x' + Math.random().toString(16).substr(2, 64),
            });
        } catch (error) {
            setNotificationState({
                isOpen: true,
                status: 'error',
                txHash: '',
            });
        }
    };

    const closeNotification = () => {
        setNotificationState({ isOpen: false, status: '', txHash: '' });
    };

    const getExplorerUrl = () => {
        return fromChain === "Ethereum Sepolia"
            ? "https://sepolia.etherscan.io"
            : "https://sepolia.basescan.org";
    };

    return (
        <>
            <div className="flex items-center justify-center h-screen">
                <div className="w-3/12 bg-white p-6 rounded-2xl border border-indigo-700">
                    <h2 className="kanit-semibold text-2xl text-indigo-700">Bridge Token</h2>
                    <p className="text-gray-400 mb-4">Send your assets across EVM chains</p>

                    <div className="flex flex-col items-center mb-4 space-y-4">
                        <div className="relative flex items-center w-full">
                            <div
                                className="flex items-center w-full p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                            >
                                <img
                                    src={fromImg}
                                    alt="ETH Logo"
                                    className="h-6 w-6 mr-2"
                                />
                                <span>{fromChain}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSwitch}
                            className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none"
                        >
                            <HiSwitchVertical className="text-l text-gray-500" />
                        </button>

                        <div className="relative flex items-center w-full">
                            <div
                                className="flex items-center w-full p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                            >
                                <img
                                    src={toImg}
                                    alt="Base Logo"
                                    className="h-6 w-6 mr-2"
                                />
                                <span>{toChain}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="amount" className="block text-sm text-gray-700">
                                Amount
                            </label>
                            <span className="text-sm text-gray-500">
                                {getCurrentBalance()} ETH
                            </span>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-4 pr-16 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Enter your desired amount"
                            />
                            <button
                                onClick={handleMax}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500"
                            >
                                MAX
                            </button>
                        </div>
                    </div>

                    {walletAddress ? (
                        <button
                            className={`w-full p-4 font-semibold rounded-lg ${amount && parseFloat(amount) >= 0.001
                                ? 'bg-gradient-to-br from-[#3B00B9] to-[#2586B6] text-white hover:from-[#2C008C] hover:to-[#1F5F8D]'
                                : 'bg-gray-400 text-white cursor-not-allowed'
                                }`}
                            disabled={!amount || parseFloat(amount) < 0.001}
                            onClick={handleBridge}
                        >
                            Bridge
                        </button>
                    ) : (
                        <button
                            className="w-full p-4 font-semibold bg-gradient-to-br from-[#3B00B9] to-[#2586B6] text-white rounded-lg hover:from-[#2C008C] hover:to-[#1F5F8D]"
                            onClick={() => requestAccount(setWalletAddress)}
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </div>
            <NotificationModal
                isOpen={notificationState.isOpen}
                onClose={closeNotification}
                status={notificationState.status}
                txHash={notificationState.txHash}
                explorerUrl={getExplorerUrl()} />
        </>
    );
}