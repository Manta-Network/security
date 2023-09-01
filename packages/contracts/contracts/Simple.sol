// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Simple {
    mapping (address => uint) public balance;

    constructor() {
    }

    function deposit(
        address account
    ) public payable {
        balance[account] += msg.value;
    }

}
