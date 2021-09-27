const NFTMarketPlace = artifacts.require("NFTMarketPlace");
const HexColour = artifacts.require("HexColour");

module.exports = (deployer) => {
  deployer.deploy(NFTMarketPlace);
  deployer.deploy(HexColour);
};
