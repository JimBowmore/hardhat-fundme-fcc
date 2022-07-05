const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

// pull these two objects from hre and export the entire function for harhat deploy
module.exports = async ({ getNamedAccounts, deployments }) => {
    // pull these two functions from hre.deployments
    const { deploy, log } = deployments
    // pull deployer account from hre.getNamedAccounts
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    //get the correct contract address from helper-hardhat-config
    // when working with localhost or hardhat network we want to use a mock
    // a mock is a minimal version of a contract for local testing
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // keep getting timeout error when calling etherscan api to verify
    //await verify(fundMe.address, args)

    log("------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
