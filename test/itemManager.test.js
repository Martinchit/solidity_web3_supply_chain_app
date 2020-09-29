const ItemManager = artifacts.require("./ItemManager.sol");

contract("ItemManager", accounts => {
  const itemName = "Test Item";
  const itemPrice = 100;
  const itemIndex = 0;
  const steps = {
    CREATE: 0,
    PAID: 1,
    DELIVERED: 2
  }
  it("should create new Item", async () => {
    const ItemManagerInstance = await ItemManager.deployed();

    const result = await ItemManagerInstance.createItem(itemName, itemPrice, { from: accounts[0] });
    assert.equal(result.logs[0].args._itemIdx, itemIndex, "There should be one item index in there");

    const item = await ItemManagerInstance.items(itemIndex);
    assert.equal(item.id, itemName, "The item has a different identifier");
  });

  it("should update supply chain status", async () => {
    const ItemManagerInstance = await ItemManager.deployed();

    const createResult = await ItemManagerInstance.createItem(itemName, itemPrice, { from: accounts[0] });
    assert.equal(createResult.logs[0].args._itemIdx, itemIndex + 1, "There should be one item index in there");
    assert.equal(createResult.logs[0].args._step, steps.CREATE, "Status is incorrect in create");

    const paymentTriggerResult = await ItemManagerInstance.triggerPayment(itemIndex, { from: accounts[0], value: itemPrice });
    assert.equal(paymentTriggerResult.logs[0].args._step, steps.PAID, "Status is incorrect in payment");

    const deliverTriggerResult = await ItemManagerInstance.triggerDelivery(itemIndex, { from: accounts[0] });
    assert.equal(deliverTriggerResult.logs[0].args._step, steps.DELIVERED, "Status is incorrect in deliver");
  });
});
