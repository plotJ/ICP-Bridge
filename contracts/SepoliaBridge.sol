import "@openzeppelin/contracts/access/Ownable.sol";

contract SepoliaBridge is Ownable {
    uint256 public nonce;

    event Deposit(address indexed from, uint256 amount, address destinationAddress, uint256 nonce);

    constructor() Ownable(msg.sender) {}

    function deposit(address destinationAddress) public payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(destinationAddress != address(0), "Invalid destination address");

        emit Deposit(msg.sender, msg.value, destinationAddress, nonce);
        nonce++;
    }

    function withdraw(uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(amount);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}