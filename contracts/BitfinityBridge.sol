// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BitfinityBridge is Ownable {
    uint256 public nonce;
    address public icpCanisterAddress;

    event Transfer(address indexed to, uint256 amount, uint256 nonce);
    event ICPCanisterAddressUpdated(address indexed oldAddress, address indexed newAddress);

    constructor() Ownable(msg.sender) payable {}

    function setICPCanisterAddress(address _icpCanisterAddress) public onlyOwner {
        require(_icpCanisterAddress != address(0), "Invalid ICP canister address");
        address oldAddress = icpCanisterAddress;
        icpCanisterAddress = _icpCanisterAddress;
        emit ICPCanisterAddressUpdated(oldAddress, _icpCanisterAddress);
    }

    function transfer(address to, uint256 amount) public {
        require(msg.sender == icpCanisterAddress, "Only ICP canister can initiate transfers");
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= address(this).balance, "Insufficient balance");

        payable(to).transfer(amount);
        emit Transfer(to, amount, nonce);
        nonce++;
    }

    function addLiquidity() public payable onlyOwner {
        // This function allows the owner to add more liquidity to the contract
    }

    function withdrawExcessLiquidity(uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(amount);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}