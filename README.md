## Supply Chain App

It is a DApp developed with the use of Solidity, Truffle and ReactJS. It provides simple for tracking inventory records

Development is done on Visual Studio Code with the use of Truffle and Meta Mask

## Features

- Contract owner can create inventory record with the supply chain status as Created

- User can transfer Wei to purchase different items and supply chain status will be updated to Paid automatically

- Contract owner can trigger delivery and supply chain status will be updated to Delivered automatically

- Address of different items are stored individually, user can transfer Wei to Item address to purchase it directly, supply chain status will be updated to Paid automatically

## Quick Start

For development, you will need Node.js and a node global package, NPM, [Truffle](https://www.trufflesuite.com/boxes) and [Meta Mask](https://metamask.io/) installed in your environment.

### Start Truffle 
  - Migrate the Solidity files for later use in web3

    ```
        $  truffle develop
        $  truffle(develop)> migrate
    ```

### Start Frontend
  - Project runs on http://localhost:3000

    ```
        $  cd client
        $  npm install
        $  npm run start
    ```

### Test
  - Run Test with Truffle

  ```
      $  truffle test
  ```