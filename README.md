#  Equipment Rental DApp (RentX)

A decentralized application (DApp) built on Ethereum that enables users to **list, rent, and return equipment** using smart contracts and MetaMask.

---

##  Key Features

*  Connect wallet using MetaMask
*  Role-based interaction (Owner & Renter)
* Add equipment (Owner only)
* View available equipment
*  Rent equipment (Renter pays ETH)
*  Return rented equipment
*  Real-time UI updates from blockchain
*  Transaction logs displayed in terminal (Hardhat)

---

## User Roles

### Owner (Account 1)

* Adds equipment items
* Becomes the owner of listed items

###  Renter (Account 2)

* Switches account in MetaMask
* Views available items
* Rents equipment
* Returns rented items

---

## How the DApp Works

### 1. Connect Wallet

* User connects MetaMask
* Wallet address and balance displayed

---

### 2.Add Equipment (Owner)

* Enter:

  * Name
  * Description
  * Price per day

 Transaction sent via MetaMask
 Equipment stored on blockchain

---

### 3. Rent Equipment (Renter)

* Switch MetaMask account
* Click **Rent** button
* Pay ETH

 Equipment becomes unavailable
 Moves to "Rented" section

---

### 4. Return Equipment

* Click **Return** button
  Equipment becomes available again

---

## Blockchain Transaction Logs

All transactions are logged in the Hardhat terminal.

Example:

```id="z91a0q"
========================================
EQUIPMENT RENTED
ID: 1
Renter: 0xbda5747bfd65f08deb54cb465eb87d40e51b197e
Payment: 100000000000000000
========================================
```

 Note:

* Payment is shown in **Wei**
* `100000000000000000 Wei = 0.1 ETH`

---

##  Tech Stack

### Blockchain

* Solidity
* Hardhat

### Frontend

* HTML, CSS, JavaScript
* Ethers.js

### Wallet

* MetaMask

---

##  Project Structure

```id="kq82ms"
equipment-rental-dapp/
│
├── blockchain/
│   ├── contracts/
│   │   └── EquipmentRental.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── hardhat.config.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│
├── README.md
├── package.json
```

---

## Setup & Run

### 1. Install dependencies

```bash id="vzb4g8"
cd blockchain
npm install
```

---

### 2. Start local blockchain

```bash id="2ahv5g"
npx hardhat node
```

---

### 3. Deploy contract

```bash id="p4y9zz"
npx hardhat run scripts/deploy.js --network localhost
```

 Copy deployed contract address

---

### 4. Update frontend

```js id="p4b0xx"
const contractAddress = "YOUR_DEPLOYED_ADDRESS";
```

---

### 5. Run frontend

Open:

```id="l3m1p8"
frontend/index.html
```

---

### 6. Setup MetaMask

* Network: Localhost 8545
* Import Hardhat accounts

---

##  Example Flow

1. Owner adds equipment
2. Renter switches account
3. Renter rents equipment
4. Equipment moves to rented list
5. Renter returns item
6. Item becomes available again

---

##  Notes

* Runs on **local blockchain (Hardhat)**
* ETH used is **test ETH (not real money)**
* Multiple MetaMask accounts required

---

##  Learning Outcomes

This project demonstrates:

* Smart contract design
* Blockchain transactions
* Role-based DApp interaction
* MetaMask integration
* Frontend–blockchain communication

---

##  Author
Bibash Bk Lamgade

---

##  License

MIT License
