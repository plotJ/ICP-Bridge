import React, { useState, useEffect } from "react";
import { requestAccount, getCurrentNetwork, switchNetwork } from '../utils/walletUtils';
import { fetchBalances } from '../utils/balanceUtils';
import NotificationModal from './NotificationModal';
import ConfirmationModal from './ConfirmationModal';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../declarations/a11_backend/a11_backend.did.js";
import { ethers } from "ethers";
import { Principal } from "@dfinity/principal";


// Create an agent and actor for IC
const agent = new HttpAgent({ host: "https://ic0.app" });
const canisterId = "ol7ll-maaaa-aaaag-all2a-cai";
const actor = Actor.createActor(idlFactory, { agent, canisterId });

// Ethereum contract details
const contractAddress = "0x87b99ee721a226503ae9f2f822aad2e044fc28c6";
const contractABI = [
    {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"nonce","type":"uint256"}],"name":"MintEvent","type":"event"},
    {"inputs":[],"name":"Mint","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
];


export default function BridgeDialog({ walletAddress, setWalletAddress }) {
    const [fromChain] = useState("Ethereum Sepolia");
    const [toChain] = useState("ICP");
    const [fromImg] = useState("/Crypto/eth.png");
    const [toImg] = useState("/Crypto/icp.png");
    const [amount, setAmount] = useState("");
    const [icpAddress, setIcpAddress] = useState("");
    const [sepoliaBalance, setSepoliaBalance] = useState("0");
    const [notificationState, setNotificationState] = useState({
        isOpen: false,
        status: '',
        txHash: '',
    });
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    useEffect(() => {
        if (walletAddress) {
            syncChainWithNetwork().then(() => {
                updateBalances();
            });
        } else {
            setSepoliaBalance("0");
            setAmount("");
        }
    }, [walletAddress]);

    const syncChainWithNetwork = async () => {
        const network = await getCurrentNetwork();
        if (network !== 'sepolia') {
            const switched = await switchNetwork('0xaa36a7'); // Ethereum Sepolia chainId
            if (!switched) {
                console.error("Failed to switch to Sepolia network");
            }
        }
    };

    const updateBalances = async () => {
        const balances = await fetchBalances(walletAddress);
        setSepoliaBalance(balances.sepoliaBalance);
    };

    const handleMax = () => {
        if (walletAddress) {
            setAmount(sepoliaBalance);
        } else {
            setAmount("0");
        }
    };

    const handleBridgeClick = () => {
        if (!walletAddress) {
            alert("Please connect your wallet first.");
            return;
        }

        if (!icpAddress) {
            alert("Please enter an ICP address.");
            return;
        }

        setIsConfirmationOpen(true);
    };

    const handleConfirmBridge = async () => {
        setIsConfirmationOpen(false);
    
        try {
            // Call the greet function on the IC canister
            const greeting = await actor.greet("Hello");
            console.log("Greeting from canister:", greeting);
    
            // Connect to Ethereum network
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
            // Call the Mint function (note the capital 'M')
            const tx = await contract.Mint();
            console.log("Mint transaction hash:", tx.hash);
    
            // Wait for the transaction to be mined
            await tx.wait();
            console.log("Mint transaction confirmed");

            console.log("Icp Address:", icpAddress);

            const Call_Bridge_ETH_to_ICP = await actor.BridgeETHToICP(String(tx.hash),Principal.fromText(icpAddress));
            console.log("Bridge_ETH_to_ICP:", Call_Bridge_ETH_to_ICP);
    
            setNotificationState({
                isOpen: true,
                status: 'success',
                txHash: tx.hash,
            });
        } catch (error) {
            console.error("Error:", error);
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

    return (
        <>
            <div className="flex items-center justify-center h-screen">
                <div className="w-3/12 bg-white p-6 rounded-2xl border border-indigo-700">
                    <h2 className="kanit-semibold text-2xl text-indigo-700">Bridge Token</h2>
                    <p className="text-gray-400 mb-4">Send your assets from Ethereum to ICP</p>

                    <div className="flex flex-col items-center mb-4 space-y-4">
                        <div className="relative flex items-center w-full">
                            <div className="flex items-center w-full p-4 border border-gray-300 rounded-lg">
                                <img src={fromImg} alt="ETH Logo" className="h-6 w-6 mr-2" />
                                <span>{fromChain}</span>
                            </div>
                        </div>

                        <div className="relative flex items-center w-full">
                            <div className="flex items-center w-full p-4 border border-gray-300 rounded-lg">
                                <img src={toImg} alt="ICP Logo" className="h-6 w-6 mr-2" />
                                <span>{toChain}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="amount" className="block text-sm text-gray-700">Amount</label>
                            <span className="text-sm text-gray-500">{sepoliaBalance} ETH</span>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-4 pr-16 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Enter amount to bridge"
                            />
                            <button
                                onClick={handleMax}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500"
                            >
                                MAX
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="icpAddress" className="block text-sm text-gray-700 mb-2">ICP Address</label>
                        <input
                            type="text"
                            id="icpAddress"
                            value={icpAddress}
                            onChange={(e) => setIcpAddress(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Enter ICP address"
                        />
                    </div>

                    {walletAddress ? (
                        <button
                            className={`w-full p-4 font-semibold rounded-lg ${amount && parseFloat(amount) > 0 && icpAddress
                                ? 'bg-gradient-to-br from-[#3B00B9] to-[#2586B6] text-white hover:from-[#2C008C] hover:to-[#1F5F8D]'
                                : 'bg-gray-400 text-white cursor-not-allowed'
                            }`}
                            disabled={!amount || parseFloat(amount) <= 0 || !icpAddress}
                            onClick={handleBridgeClick}
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
                <NotificationModal
                    isOpen={notificationState.isOpen}
                    onClose={closeNotification}
                    status={notificationState.status}
                    txHash={notificationState.txHash}
                    explorerUrl="https://sepolia.etherscan.io"
                />
                <ConfirmationModal
                    isOpen={isConfirmationOpen}
                    onClose={() => setIsConfirmationOpen(false)}
                    onConfirm={handleConfirmBridge}
                    amount={amount}
                    icpAddress={icpAddress}
                />
            </div>
        </>
    );
}