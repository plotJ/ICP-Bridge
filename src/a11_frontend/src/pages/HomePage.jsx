import React, { useState } from "react"
import Navbar from "../components/Navbar"
import BridgeDialog from "../components/BridgeDialog"

export default function App() {
	const [walletAddress, setWalletAddress] = useState("")

	return (
		<>
			<div className="relative overflow-hidden h-screen">
				<Navbar
					walletAddress={walletAddress}
					setWalletAddress={setWalletAddress}
				/>
				<div className="items-center justify-center">
					<BridgeDialog
						walletAddress={walletAddress}
						setWalletAddress={setWalletAddress}
					/>
				</div>
				<img
					src="/icp-gradient.png"
					alt="ICP Gradient"
					className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3 h-auto"
				/>
			</div>
		</>
	)
}
