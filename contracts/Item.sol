pragma solidity ^0.6.0;

import "./ItemManager.sol";

contract Item {
    uint public index;
    uint public pricePaid;
    uint public priceInWei;
    
    ItemManager parentContract;
    
    constructor(ItemManager _parentContract, uint _index,  uint _priceInWei) public {
        index = _index;
        priceInWei = _priceInWei;
        parentContract = _parentContract;
    }
    
    receive() external payable {
        require(pricePaid == 0, "Item is paid already");
        require(priceInWei == msg.value, "Only accept full payment. No change!");
        pricePaid += msg.value;
        (bool success, ) = address(parentContract).call.value(msg.value)(abi.encodeWithSignature("triggerPayment(uint256)", index));
        require(success, "Transaction failed, canceling");
    }
    
    fallback() external {
    }
}