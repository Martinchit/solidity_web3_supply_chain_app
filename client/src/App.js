import React from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";

export const Web3SetUp = () => {
  const [web3, setWeb3] = React.useState(null);
  const [accounts, setAccounts] = React.useState(null);
  const [itemManagerContract, setItemManagerContract] = React.useState(null);
  const [itemContract, setItemContract] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const setUp = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const itemManagerContract = new web3.eth.Contract(
          ItemManagerContract.abi,
          ItemManagerContract.networks[networkId] && ItemManagerContract.networks[networkId].address,
        );
        const itemContract = new web3.eth.Contract(
          ItemContract.abi,
          ItemContract.networks[networkId] && ItemContract.networks[networkId].address,
        );
        setWeb3(web3);
        setAccounts(accounts);
        setItemManagerContract(itemManagerContract);
        setItemContract(itemContract);
        setLoaded(true);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    }

    setUp();
  }, []);

  return [web3, accounts, itemManagerContract, itemContract, loaded, error]
}

const App = () => {
  const [web3, accounts, itemManagerContract, itemContract, loaded, error] = Web3SetUp();
  const [cost, setCost] = React.useState(0);
  const [itemName, setItemName] = React.useState('123');

  React.useEffect(() => {
    const listenToPaymentEvent = () => {
      itemManagerContract.events.SupplyChainStepUpdate().on('data', async ({ returnValues }) => {
        const { _step } = returnValues;
        if (_step === 1) {
          const { _itemIdx } = returnValues;
          const itemObj = await itemManagerContract.methods.items(_itemIdx).call();
          alert(`Item ${itemObj._id} was paid, deliver it now!`);
        } else if (_step === 2) {
          const { _itemIdx } = returnValues;
          alert(`Item ${_itemIdx} was delivered`);
        }
      })
    }
    if (itemManagerContract) {
      listenToPaymentEvent();
    }
  }, [itemManagerContract])

  const handleInputChange = React.useCallback(({ target }) => {
    const { value, name } = target;
    name === "cost" ? setCost(value) : setItemName(value);
  }, [])

  const handleSubmit = React.useCallback(async () => {
    try {
      const result = await itemManagerContract.methods.createItem(itemName, cost).send({ from: accounts[0] });
      console.log(result);
      alert(`Send ${cost} Wei to ${result.events.SupplyChainStepUpdate.returnValues._itemAddress}`);
    } catch (error) {
      console.log(error);
    }
  }, [accounts, cost, itemManagerContract, itemName])

  return (
    <div className="App">
      {
        error ? (
          <div>Error</div>
        ) : loaded ? (
          <React.Fragment>
            <h1>Simply Payment/Supply Chain Example!</h1>
            <h2>Items</h2>
            <h2>Add Element</h2>
            <label>Cost:</label>
            <input
              type="text"
              name="cost"
              value={cost}
              onChange={handleInputChange}
            />
            <label>Item Name:</label>
            <input 
              type="text"
              name="itemName"
              value={itemName} 
              onChange={handleInputChange} 
            />
            <button type="button" onClick={handleSubmit}>Create new Item</button>
            </React.Fragment>
        ) : (
          <div>Loading Web3, accounts, and contract...</div>
        )
      }
    </div>
  )
}

export default App;
