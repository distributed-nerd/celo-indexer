// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CeloToken
 * @dev ERC20 Token for the Celo ecosystem
 */
contract CeloToken is ERC20, ERC20Burnable, Ownable {
    uint8 private _decimals;
    
    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     * @param name Token name
     * @param symbol Token symbol
     * @param initialSupply Initial supply of tokens (in whole units, not wei)
     * @param tokenDecimals Number of decimals for the token
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 tokenDecimals
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _decimals = tokenDecimals;
        _mint(msg.sender, initialSupply * 10 ** tokenDecimals);
    }

    /**
     * @dev Returns the number of decimals used for token amounts.
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Mint new tokens. Only owner can call this function.
     * @param to Address to receive the minted tokens
     * @param amount Amount of tokens to mint (in whole units)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount * 10 ** _decimals);
    }
}
