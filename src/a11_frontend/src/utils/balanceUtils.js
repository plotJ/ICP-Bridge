import { ethers } from "ethers";
import { getCurrentNetwork } from "./walletUtils";

export const fetchBalances = async (walletAddress) => {
    const currentNetwork = await getCurrentNetwork();
    
    const sepoliaProvider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/16e2639c949045b88080eef9b528d565");
    const baseSepoliaProvider = new ethers.JsonRpcProvider("https://sepolia.base.org");

    try {
        let sepoliaBalance = "0";
        let baseSepoliaBalance = "0";

        if (currentNetwork === 'sepolia') {
            const sepoliaBalanceWei = await sepoliaProvider.getBalance(walletAddress);
            sepoliaBalance = ethers.formatEther(sepoliaBalanceWei);
        } else if (currentNetwork === 'base-sepolia') {
            const baseSepoliaBalanceWei = await baseSepoliaProvider.getBalance(walletAddress);
            baseSepoliaBalance = ethers.formatEther(baseSepoliaBalanceWei);
        }

        return {
            sepoliaBalance,
            baseSepoliaBalance
        };
    } catch (error) {
        console.error("Error fetching balances:", error);
        return {
            sepoliaBalance: "0",
            baseSepoliaBalance: "0"
        };
    }
};