pragma solidity ^0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ItemManager.sol";

contract TestItemManager {

  function testCreateAnItem() public {
    uint price = 100;
    string memory id = "Test";
    uint index;
    ItemManager itemManager = ItemManager(DeployedAddresses.ItemManager());
    itemManager.createItem(id, price);
    Assert.equal(itemManager.items[index].id, id, "Incorrect ID");
    Assert.equal(itemManager.items[index].price, price, "Incorrect ID");
  }

}
