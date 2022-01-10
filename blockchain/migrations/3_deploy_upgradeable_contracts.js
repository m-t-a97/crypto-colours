const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const NFTMarketPlace = artifacts.require("NFTMarketPlace");
const HexColour = artifacts.require("HexColour");

module.exports = async (deployer) => {
  const hexColourProxyContract = await deployProxy(HexColour, {
    deployer,
    initializer: "initialize",
  });

  const nftMarketPlaceProxyContract = await deployProxy(NFTMarketPlace, {
    deployer,
    initializer: "initialize",
  });
};
