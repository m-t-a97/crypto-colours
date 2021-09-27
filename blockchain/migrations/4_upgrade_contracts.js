const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const HexColour = artifacts.require("HexColour");
const NFTMarketPlace = artifacts.require("NFTMarketPlace");

module.exports = async (deployer) => {
  const existingHexColour = await HexColour.deployed();
  await upgradeProxy(existingHexColour.address, HexColour, { deployer });

  const existingNFTMarketPlace = await NFTMarketPlace.deployed();
  await upgradeProxy(existingNFTMarketPlace.address, NFTMarketPlace, {
    deployer,
  });
};
