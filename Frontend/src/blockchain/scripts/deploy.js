// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const BulkPayroll = await ethers.getContractFactory("BulkPayroll");
    const bulkPayroll = await BulkPayroll.deploy(/* constructor args */);

    // For newer ethers versions (v6+)
    await bulkPayroll.waitForDeployment();
    console.log("BulkPayroll deployed to:", await bulkPayroll.getAddress());
}

// Execute the main function and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
