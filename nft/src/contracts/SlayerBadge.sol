// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "../../node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "../../node_modules/@openzeppelin/contracts/security/Pausable.sol";


contract SlayerBadge is 
	ERC721, 
	ERC721Enumerable, 
	ERC721URIStorage, 
	Pausable, 
	AccessControl, 
	ERC721Burnable 
{
	using Counters for Counters.Counter;
	
	bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
	bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
	Counters.Counter private _tokenIdCounter;
	
	uint256 private immutable _cap;
	address public  contractOwner;
	uint256 private _mintFee;

	// mapping(uint256 => address) balances;

	constructor() ERC721("ROSlayers", "ROS") {
		_setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_setupRole(PAUSER_ROLE, msg.sender);
		_setupRole(MINTER_ROLE, msg.sender);
		_cap = 10;
		contractOwner = msg.sender;
		_mintFee = 0.01 ether;
	}

	function pause() public onlyRole(PAUSER_ROLE) {
		_pause();
	}

	function unpause() public onlyRole(PAUSER_ROLE) {
		_unpause();
	}
	
	/**
	* Events 
	*/

	event mintFeeChanged(uint256 fee);

	function cap() public view virtual returns (uint256) {
			return _cap;
	}
	
	function setMintFee(uint256 fee) public onlyRole(DEFAULT_ADMIN_ROLE) {
		// check if caller is admin
		require(
			hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
			"Caller must have admin role to set mint fee"
		);
		_mintFee = fee;
		emit mintFeeChanged(fee);
	}

	function getMintFee() public view returns (uint256) {
		return _mintFee;
	}

	function contractURI() public pure returns (string memory) {
			return "https://gateway.pinata.cloud/ipfs/QmRLrF5nMMsqkpgWWSgePKNVU2piWHSzjGVHBsRK95dio7";
	}

	function mint(string memory tokenURI) public payable onlyRole(MINTER_ROLE) {
		require(totalSupply() <= cap(), "ERC721 Cap: cap reached");
		require(msg.value >= _mintFee, "Not enough ETH sent: check price.");
		// Forward amount to contract adddress
		(bool success, ) = payable(contractOwner).call{value: msg.value}("");
		require(success, "Unable to send minting fee");
		_tokenIdCounter.increment();
		_safeMint(msg.sender, _tokenIdCounter.current());
		_setTokenURI(_tokenIdCounter.current(), tokenURI);
			
	}

	// function sendEthToContract(uint256 amount) public payable {

	// }

	// error InsufficientBalance(uint requested, uint available);

	// function send(address receiver, uint amount) public payable {
	// 	if (amount > balances[msg.sender])
	// 	balanceOf(msg.sender); // += msg.value;
	// }

	// Transfer funds
	function transferFunds(address payable to ) public payable {
		// payable(to).transfer(msg.value);
		(bool sent, bytes memory data) = to.call{value: msg.value}("");
		require(sent, "Falied to send!");		
	}

	receive() external payable {
		// mint("");
	}

	fallback() external payable {}

	function getBalance() public view returns (uint) {
		return address(this).balance;
	}
    
	function _beforeTokenTransfer(address from, address to, uint256 tokenId)
	internal
	whenNotPaused
	override(ERC721, ERC721Enumerable)
	{
		super._beforeTokenTransfer(from, to, tokenId);
	}

// The following functions are overrides required by Solidity.

	function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
		super._burn(tokenId);
	}

	function tokenURI(uint256 tokenId)
		public
		view
		override(ERC721, ERC721URIStorage)
		returns (string memory)
	{
		return super.tokenURI(tokenId);
	}

	function supportsInterface(bytes4 interfaceId)
		public
		view
		override(ERC721, ERC721Enumerable, AccessControl)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}

}