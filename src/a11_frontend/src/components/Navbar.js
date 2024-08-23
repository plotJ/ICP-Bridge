import React from "react";
import { FaWallet, FaSignOutAlt } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { requestAccount, handleLogout, truncateAddress } from '../utils/walletUtils';

export default function Navbar({ walletAddress, setWalletAddress }) {

	return (
		<nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 dark:border-gray-600">
			<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
				<a
					href="https://internetcomputer.org/"
					className="flex items-center space-x-3 rtl:space-x-reverse"
				>
					<img
						src="/bridge-logo.png"
						className="h-16"
						alt="ICP Bridge Logo"
					/>
				</a>
				<div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
					{/* Conditionally render buttons based on wallet address */}
					{!walletAddress ? (
						<button
							type="button"
							className="text-white font-medium bg-gradient-to-br from-[#3B00B9] to-[#2586B6] rounded-lg transition-colors duration-300 hover:from-[#2C008C] hover:to-[#1F5F8D] focus:ring-4 focus:outline-none focus:ring-blue-300 text-sm px-4 py-2 text-center flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							onClick={() => requestAccount(setWalletAddress)}
						>
							<FaWallet className="mr-2" />
							Connect Wallet
						</button>
					) : (
						<>
							<div className="flex items-center text-white font-medium text-sm bg-gradient-to-br from-[#3B00B9] to-[#2586B6] rounded-lg transition-colors duration-300 hover:from-[#2C008C] hover:to-[#1F5F8D] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
								<div className="flex items-center px-3 py-2">
									<IoPersonCircle className="h-5 w-5 mr-2" />
									{truncateAddress(walletAddress)}
								</div>
								<div className="w-px h-6 bg-white/20"></div>
								<button
									onClick={() => handleLogout(setWalletAddress)}
									className="px-3 py-2 hover:bg-white/10 rounded-r-lg transition-colors duration-300"
								>
									<FaSignOutAlt className="h-4 w-4" />
								</button>
							</div>
						</>
					)}
					{/* <button
						data-collapse-toggle="navbar-sticky"
						type="button"
						className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
						aria-controls="navbar-sticky"
						aria-expanded="false"
					>
						<span className="sr-only">Open main menu</span>
						<svg
							className="w-5 h-5"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 17 14"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M1 1h15M1 7h15M1 13h15"
							/>
						</svg>
					</button> */}
				</div>
				<div
					className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
					id="navbar-sticky"
				>
					<ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
						<li>
							<a
								href="https://github.com/plotJ/ICP-Bridge"
								className="block py-2 px-3 text-gray-900 rounded md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
								aria-current="page"
							>
								About
							</a>
						</li>
						<li>
							<p
								className="font-bold block py-2 px-3 bg-gradient-to-r from-[#3B00B9] to-[#2586B6] bg-clip-text text-transparent rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
							>
								Bridge
							</p>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}