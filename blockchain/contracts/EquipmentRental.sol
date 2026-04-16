// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "hardhat/console.sol"; // 

contract EquipmentRental {
    uint public equipmentCount = 0;

    struct Equipment {
        uint id;
        string name;
        string description;
        uint pricePerDay;
        bool isAvailable;
        address owner;
        address renter;
    }

    mapping(uint => Equipment) public equipments;

    event EquipmentAdded(uint id, string name, uint pricePerDay, address owner);
    event EquipmentRented(uint id, address renter);
    event EquipmentReturned(uint id);

    function addEquipment(
        string memory _name,
        string memory _description,
        uint _pricePerDay
    ) public {
        equipmentCount++;

        equipments[equipmentCount] = Equipment(
            equipmentCount,
            _name,
            _description,
            _pricePerDay,
            true,
            msg.sender,
            address(0)
        );


        console.log("========================================");
        console.log(" EQUIPMENT ADDED");
        console.log("   ID:", equipmentCount);
        console.log("   Name:", _name);
        console.log("   Price:", _pricePerDay);
        console.log("   Owner:", msg.sender);
        console.log("========================================");

        emit EquipmentAdded(equipmentCount, _name, _pricePerDay, msg.sender);
    }

    function rentEquipment(uint _id) public payable {
        require(_id > 0 && _id <= equipmentCount, "Invalid ID");
        require(equipments[_id].isAvailable, "Not available");
        require(equipments[_id].owner != msg.sender, "Owner cannot rent");
        require(msg.value >= equipments[_id].pricePerDay, "Insufficient payment");

        equipments[_id].isAvailable = false;
        equipments[_id].renter = msg.sender;

        // ADD THESE CONSOLE LOGS
        console.log("========================================");
        console.log("EQUIPMENT RENTED");
        console.log("   ID:", _id);
        console.log("   Renter:", msg.sender);
        console.log("   Payment:", msg.value);
        console.log("========================================");

        emit EquipmentRented(_id, msg.sender);
    }

    function returnEquipment(uint _id) public {
        require(_id > 0 && _id <= equipmentCount, "Invalid ID");
        require(equipments[_id].renter == msg.sender, "Not the renter");

        address payable owner = payable(equipments[_id].owner);
        uint price = equipments[_id].pricePerDay;
        
        equipments[_id].isAvailable = true;
        equipments[_id].renter = address(0);

        (bool success, ) = owner.call{value: price}("");
        require(success, "Payment failed");

        // ADD THESE CONSOLE LOGS
        console.log("========================================");
        console.log("EQUIPMENT RETURNED");
        console.log("   ID:", _id);
        console.log("   Refund sent to:", owner);
        console.log("   Amount:", price);
        console.log("========================================");

        emit EquipmentReturned(_id);
    }

    function getEquipment(uint _id) public view returns (
        uint,
        string memory,
        string memory,
        uint,
        bool,
        address,
        address
    ) {
        Equipment memory e = equipments[_id];
        return (
            e.id,
            e.name,
            e.description,
            e.pricePerDay,
            e.isAvailable,
            e.owner,
            e.renter
        );
    }
}