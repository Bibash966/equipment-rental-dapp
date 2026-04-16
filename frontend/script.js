
let provider;
let signer;
let contract;
let currentAddress;


const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
  { 
    "anonymous": false, 
    "inputs": [ 
      { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, 
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" }, 
      { "indexed": false, "internalType": "uint256", "name": "pricePerDay", "type": "uint256" }, 
      { "indexed": false, "internalType": "address", "name": "owner", "type": "address" } 
    ], 
    "name": "EquipmentAdded", 
    "type": "event" 
  }, 
  { 
    "anonymous": false, 
    "inputs": [ 
      { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, 
      { "indexed": false, "internalType": "address", "name": "renter", "type": "address" } 
    ], 
    "name": "EquipmentRented", 
    "type": "event" 
  }, 
  { 
    "anonymous": false, 
    "inputs": [ 
      { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" } 
    ], 
    "name": "EquipmentReturned", 
    "type": "event" 
  },
  { 
    "inputs": [ 
      { "internalType": "string", "name": "_name", "type": "string" }, 
      { "internalType": "string", "name": "_description", "type": "string" }, 
      { "internalType": "uint256", "name": "_pricePerDay", "type": "uint256" } 
    ], 
    "name": "addEquipment", 
    "outputs": [], 
    "stateMutability": "nonpayable", 
    "type": "function" 
  }, 
  { 
    "inputs": [], 
    "name": "equipmentCount", 
    "outputs": [ 
      { "internalType": "uint256", "name": "", "type": "uint256" } 
    ], 
    "stateMutability": "view", 
    "type": "function" 
  }, 
  { 
    "inputs": [ 
      { "internalType": "uint256", "name": "", "type": "uint256" } 
    ], 
    "name": "equipments", 
    "outputs": [ 
      { "internalType": "uint256", "name": "id", "type": "uint256" }, 
      { "internalType": "string", "name": "name", "type": "string" }, 
      { "internalType": "string", "name": "description", "type": "string" }, 
      { "internalType": "uint256", "name": "pricePerDay", "type": "uint256" }, 
      { "internalType": "bool", "name": "isAvailable", "type": "bool" }, 
      { "internalType": "address", "name": "owner", "type": "address" }, 
      { "internalType": "address", "name": "renter", "type": "address" } 
    ], 
    "stateMutability": "view", 
    "type": "function" 
  }, 
  { 
    "inputs": [ 
      { "internalType": "uint256", "name": "_id", "type": "uint256" } 
    ], 
    "name": "getEquipment", 
    "outputs": [ 
      { "internalType": "uint256", "name": "", "type": "uint256" }, 
      { "internalType": "string", "name": "", "type": "string" }, 
      { "internalType": "string", "name": "", "type": "string" }, 
      { "internalType": "uint256", "name": "", "type": "uint256" }, 
      { "internalType": "bool", "name": "", "type": "bool" }, 
      { "internalType": "address", "name": "", "type": "address" }, 
      { "internalType": "address", "name": "", "type": "address" } 
    ], 
    "stateMutability": "view", 
    "type": "function" 
  }, 
  { 
    "inputs": [ 
      { "internalType": "uint256", "name": "_id", "type": "uint256" } 
    ], 
    "name": "rentEquipment", 
    "outputs": [], 
    "stateMutability": "payable", 
    "type": "function" 
  }, 
  { 
    "inputs": [ 
      { "internalType": "uint256", "name": "_id", "type": "uint256" } 
    ], 
    "name": "returnEquipment", 
    "outputs": [], 
    "stateMutability": "nonpayable", 
    "type": "function" 
  }
];

// Display status message
function showStatus(message, type = 'info') {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = type;
  setTimeout(() => {
    statusDiv.textContent = '';
    statusDiv.className = '';
  }, 5000);
}

// Connect wallet
async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    currentAddress = await signer.getAddress();

    const balance = await provider.getBalance(currentAddress);
    
    document.getElementById("walletAddress").innerText = currentAddress;
    document.getElementById("walletBalance").innerText = parseFloat(ethers.formatEther(balance)).toFixed(4);
    document.getElementById("walletInfo").style.display = "block";
    document.getElementById("connectBtn").innerText = "Connected";
    document.getElementById("connectBtn").disabled = true;

    contract = new ethers.Contract(contractAddress, abi, signer);
    
    showStatus("Wallet connected successfully!", "success");
    loadEquipment();
  } catch (error) {
    console.error(error);
    showStatus("Failed to connect wallet: " + error.message, "error");
  }
}

// Switch account
async function switchAccount() {
  try {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    
    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }]
    });
    
    window.location.reload();
  } catch (error) {
    console.error(error);
    showStatus("Please switch account manually in MetaMask", "info");
  }
}

// Add equipment
async function addEquipment() {
  try {
    if (!contract) {
      alert('Please connect wallet first!');
      return;
    }

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const desc = document.getElementById("desc").value;

    if (!name || !price || !desc) {
      alert('Please fill all fields!');
      return;
    }

    console.log("=== ADDING EQUIPMENT ===");
    console.log("Name:", name);
    console.log("Price:", price, "ETH");
    console.log("Description:", desc);
    console.log("Owner:", currentAddress);
    
    const tx = await contract.addEquipment(
      name,
      desc,
      ethers.parseEther(price)
    );

    console.log("Transaction sent:", tx.hash);
    showStatus("Adding equipment... Please confirm transaction in MetaMask", "info");
    
    await tx.wait();
    console.log("Transaction confirmed!");
    showStatus("Equipment added successfully!", "success");

    document.getElementById("name").value = '';
    document.getElementById("price").value = '';
    document.getElementById("desc").value = '';

    loadEquipment();
  } catch (error) {
    console.error(error);
    showStatus("Failed to add equipment: " + error.message, "error");
  }
}

// Rent equipment
async function rentEquipment(id, price) {
  try {
    if (!contract) {
      alert('Please connect wallet first!');
      return;
    }

    const priceInEth = ethers.formatEther(price);
    console.log("=== RENTING EQUIPMENT ===");
    console.log("Equipment ID:", id);
    console.log("Price:", priceInEth, "ETH");
    console.log("Renter:", currentAddress);
    
    showStatus(`Renting equipment... Sending ${priceInEth} ETH. Confirm in MetaMask`, "info");
    
    const tx = await contract.rentEquipment(id, { 
      value: price,
      gasLimit: 300000
    });
    
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed!");
    showStatus("Equipment rented successfully!", "success");
    loadEquipment();
  } catch (error) {
    console.error(error);
    showStatus("Failed to rent: " + error.message, "error");
  }
}

// Return equipment
async function returnEquipment(id) {
  try {
    if (!contract) {
      alert('Please connect wallet first!');
      return;
    }

    console.log("=== RETURNING EQUIPMENT ===");
    console.log("Equipment ID:", id);
    console.log("Returning as:", currentAddress);
    
    showStatus("Returning equipment... Confirm transaction in MetaMask", "info");
    
    const tx = await contract.returnEquipment(id, {
      gasLimit: 300000
    });
    
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed!");
    showStatus("Equipment returned successfully!", "success");
    loadEquipment();
  } catch (error) {
    console.error(error);
    showStatus("Failed to return: " + error.message, "error");
  }
}

// Load equipment list
async function loadEquipment() {
  try {
    if (!contract) {
      document.getElementById("availableList").innerHTML = "<p>Please connect wallet</p>";
      return;
    }

    const count = await contract.equipmentCount();
    const available = document.getElementById("availableList");
    const rented = document.getElementById("rentedList");

    available.innerHTML = "";
    rented.innerHTML = "";

    if (count == 0) {
      available.innerHTML = "<p style='text-align:center; grid-column: 1/-1; color:#666;'>No equipment available yet</p>";
      return;
    }

    for (let i = 1; i <= count; i++) {
      const item = await contract.equipments(i);
      const isOwner = item.owner.toLowerCase() === currentAddress.toLowerCase();
      const isRenter = item.renter.toLowerCase() === currentAddress.toLowerCase();

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${item.name}</h3>
        <p style="color:#666; font-size:14px;">${item.description}</p>
        <p class="price">${ethers.formatEther(item.pricePerDay)} ETH/day</p>
        <div class="owner-info">
          <strong>Owner:</strong> ${item.owner}<br>
          ${item.renter !== '0x0000000000000000000000000000000000000000' ? `<strong>Renter:</strong> ${item.renter}` : ''}
        </div>
        <p class="${item.isAvailable ? 'available' : 'rented'}">
          ${item.isAvailable ? '✓ Available' : '✗ Rented'}
        </p>
      `;

      if (item.isAvailable) {
        if (isOwner) {
          const badge = document.createElement("div");
          badge.className = "badge badge-owner";
          badge.innerText = " Your Item (Owner)";
          card.appendChild(badge);
          available.appendChild(card);
        } else {
          const btn = document.createElement("button");
          btn.className = "rent-btn";
          btn.innerText = `Rent for ${ethers.formatEther(item.pricePerDay)} ETH`;
          btn.onclick = () => {
            console.log("Rent button clicked!");
            rentEquipment(i, item.pricePerDay);
          };
          card.appendChild(btn);
          available.appendChild(card);
        }
      } else {
        if (isRenter) {
          const btn = document.createElement("button");
          btn.className = "return-btn";
          btn.innerText = "Return Equipment";
          btn.onclick = () => {
            console.log("Return button clicked!");
            returnEquipment(i);
          };
          card.appendChild(btn);
          rented.appendChild(card);
        } else if (isOwner) {
          const badge = document.createElement("div");
          badge.className = "badge badge-rented";
          badge.innerText = ` Rented by: ${item.renter}`;
          card.appendChild(badge);
          rented.appendChild(card);
        } else {
          const badge = document.createElement("div");
          badge.className = "badge badge-rented";
          badge.innerText = "Already Rented";
          card.appendChild(badge);
          rented.appendChild(card);
        }
      }
    }
  } catch (error) {
    console.error(error);
    showStatus("Failed to load equipment: " + error.message, "error");
  }
}

// Listen for account changes
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    console.log("Account changed:", accounts[0]);
    window.location.reload();
  });
}

// Auto-load on page load
window.onload = async () => {
  if (window.ethereum) {
    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      contract = new ethers.Contract(contractAddress, abi, provider);
      
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        await connectWallet();
      }
    } catch (error) {
      console.error("Error initializing:", error);
    }
  } else {
    alert('Please install MetaMask to use this DApp!');
  }
};