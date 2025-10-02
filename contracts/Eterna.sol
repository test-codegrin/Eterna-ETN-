// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Eterna Token (ETN)
 * @author CodeGrin Technologies
 * @notice ERC-20 compliant token deployed on BNB Smart Chain
 * @dev Implements standard ERC-20 with burn capability and ownership control
 */
contract Eterna is ERC20, ERC20Burnable, Ownable {
    uint8 private constant _decimals = 18;

    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    /**
     * @notice Constructor mints initial supply to deployer
     * @param initialSupply The initial token supply (in whole tokens)
     */
    constructor(uint256 initialSupply) ERC20("Eterna", "ETN") Ownable(msg.sender) {
        require(initialSupply > 0, "Eterna: initial supply must be greater than 0");

        uint256 mintAmount = initialSupply * 10 ** decimals();
        _mint(msg.sender, mintAmount);

        emit TokensMinted(msg.sender, mintAmount);
    }

    /**
     * @notice Returns the number of decimals used by the token
     * @return uint8 Number of decimals (18)
     */
    function decimals() public pure override returns (uint8) {
        return _decimals;
    }

    /**
     * @notice Allows owner to mint additional tokens
     * @param to Address to receive minted tokens
     * @param amount Amount of tokens to mint (in wei)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Eterna: cannot mint to zero address");
        require(amount > 0, "Eterna: mint amount must be greater than 0");

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @notice Burns tokens from caller's account
     * @dev Overrides ERC20Burnable to add event emission
     * @param amount Amount of tokens to burn (in wei)
     */
    function burn(uint256 amount) public override {
        require(amount > 0, "Eterna: burn amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Eterna: insufficient balance to burn");

        super.burn(amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @notice Burns tokens from specified account (requires allowance)
     * @dev Overrides ERC20Burnable to add event emission
     * @param account Account to burn tokens from
     * @param amount Amount of tokens to burn (in wei)
     */
    function burnFrom(address account, uint256 amount) public override {
        require(account != address(0), "Eterna: cannot burn from zero address");
        require(amount > 0, "Eterna: burn amount must be greater than 0");
        require(balanceOf(account) >= amount, "Eterna: insufficient balance to burn");

        super.burnFrom(account, amount);
        emit TokensBurned(account, amount);
    }

    /**
     * @notice Transfers tokens with additional validation
     * @param to Recipient address
     * @param amount Amount to transfer (in wei)
     * @return bool Success status
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(to != address(0), "Eterna: cannot transfer to zero address");
        require(amount > 0, "Eterna: transfer amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Eterna: insufficient balance");

        return super.transfer(to, amount);
    }

    /**
     * @notice Transfers tokens on behalf of another account
     * @param from Sender address
     * @param to Recipient address
     * @param amount Amount to transfer (in wei)
     * @return bool Success status
     */
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        require(from != address(0), "Eterna: cannot transfer from zero address");
        require(to != address(0), "Eterna: cannot transfer to zero address");
        require(amount > 0, "Eterna: transfer amount must be greater than 0");
        require(balanceOf(from) >= amount, "Eterna: insufficient balance");

        return super.transferFrom(from, to, amount);
    }
}
