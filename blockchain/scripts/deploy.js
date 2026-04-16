async function main() {
  const EquipmentRental = await ethers.getContractFactory("EquipmentRental");
  const equipmentRental = await EquipmentRental.deploy();

  await equipmentRental.waitForDeployment();

  console.log("Contract deployed to:", equipmentRental.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});