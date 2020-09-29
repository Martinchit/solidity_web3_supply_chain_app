pragma solidity ^0.6.0;

import "./Item.sol";
import "./Ownable.sol";

contract ItemManager is Ownable {

  enum SupplyChainState{
    Created,
    Paid,
    Delivered
  }

  struct SupplyChainItem {
    Item item;
    string id;
    uint price;
    SupplyChainState status;
  }

  mapping(uint => SupplyChainItem) public items;
  uint itemIndex;
  
  event SupplyChainStepUpdate(uint _itemIdx, uint _step, address _itemAddress);

  function createItem(string memory _itemId, uint _itemPrice) public onlyOwner {
    items[itemIndex].item = new Item(this, itemIndex, _itemPrice);
    items[itemIndex].id = _itemId;
    items[itemIndex].price = _itemPrice;
    items[itemIndex].status = SupplyChainState.Created;
    emit SupplyChainStepUpdate(itemIndex, uint(items[itemIndex].status), address(items[itemIndex].item));
    itemIndex++;
  }

  function triggerPayment(uint _itemIdx) public payable {
    require(items[_itemIdx].price == msg.value, "Only accept full payment. No change!");
    require(items[_itemIdx].status == SupplyChainState.Created, "Item is sold!");
    
    items[_itemIdx].status = SupplyChainState.Paid;
    emit SupplyChainStepUpdate(_itemIdx, uint(items[_itemIdx].status), address(items[_itemIdx].item));
  }
  
  
  function triggerDelivery(uint _itemIdx) public onlyOwner {
    if (items[_itemIdx].status == SupplyChainState.Delivered) {
        revert("Item is delivered");
    }
    require(items[_itemIdx].status == SupplyChainState.Paid, "Item is not paid!");

    items[_itemIdx].status = SupplyChainState.Delivered;
    emit SupplyChainStepUpdate(_itemIdx, uint(items[_itemIdx].status), address(items[_itemIdx].item));
  }
}