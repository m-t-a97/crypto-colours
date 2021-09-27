const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const NFTMarketPlace = artifacts.require("NFTMarketPlace");
const HexColour = artifacts.require("HexColour");

module.exports = async (deployer) => {
  deployer.link(NFTMarketPlace, HexColour);

  const nftMarketPlaceProxyContract = await deployProxy(NFTMarketPlace, {
    deployer,
    initializer: "initialize",
  });

  console.log(
    "nftMarketPlaceProxyContract address:",
    nftMarketPlaceProxyContract.address
  );

  const hexColourProxyContract = await deployProxy(
    HexColour,
    [nftMarketPlaceProxyContract.address],
    {
      deployer,
      initializer: "initialize",
    }
  );

  console.log(
    "hexColourProxyContract address:",
    hexColourProxyContract.address
  );
};
