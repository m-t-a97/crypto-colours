# Crypto Colours

![image](https://user-images.githubusercontent.com/54685928/148663728-648a62f1-52bd-415b-96b4-4b2f0ba3d590.png)

## Setup

Install the dependencies for the app.

```bash
yarn install
```

Then install truffle globally:

```bash
npm i -g truffle
```

---

## Ganache

Use the `Muir Glacier Hard Fork` in Ganache as it was the hard fork version used when developing this app.

---

## Running the app

Navigate to the `blockchain` folder and do the following running the app:

```bash
truffle compile --all
truffle migrate --network development
```

Then navigate back to the root of the project and run:

```bash
yarn dev
```

---

## Contracts

Navigate to the `blockchain` folder:

```bash
# Compile contracts
truffle compile --all

# To migrate contracts
truffle migrate --reset --network development

# Connect to localhost running ganache via console to run commands on smart contracts
truffle console --network development

# To run tests on the smart contracts
truffle test
```

---

## Commands for Truffle console

```bash
# Fetching all accounts
accounts = await web3.eth.getAccounts()

# Deploying a contract manually
hexColour = await HexColour.deployed()
nftMarketPlace = await NFTMarketPlace.deployed()

# Get a reference to the upgradeable contracts via the console during deployment
# then you can use it in the truffle console.
hexColour = await HexColour.at("<address>");
nftMarketPlace = await NFTMarketPlace.at("<address>");

# Useful util commands to use within the truffle console
web3.utils.toWei("0.025", "ether")
web3.utils.fromWei("25000000000000000", "ether")
```

---

## MetaMask

To connect your wallet to MetaMask, copy the private key from one of your ganache wallet addresses and then import it into MetaMask. Make sure to switch to the Ganache network to see the Ether in your account's wallet.

---

## Local Development

Add `localhost` as the value of `development.host` in the `networks` config in the `truffle-config.js` file to work with Ganache GUI locally.

### Using Docker:

If using Docker on Windows, add `host.docker.internal` as the value of `development.host` in the `networks` config within `truffle-config.js`. This will allow you to connect from within Docker to the Windows host running Ganache.

---
