import _ from 'lodash';

import nftMarketPlaceAsJson from '@blockchain/build/contracts/NFTMarketPlace.json';

let address: string = "";

if (!_.isEqual(process.env.NODE_ENV, "production")) {
  address = nftMarketPlaceAsJson.networks[5777].address;
} else {
  address =
    process.env.NEXT_PUBLIC_POLYGON_TESTNET_NFT_MARKET_PLACE_CONTRACT_ADDRESS;
}

export const NFT_MARKET_PLACE_CONTRACT_ABI = nftMarketPlaceAsJson.abi;
export const NFT_MARKET_PLACE_CONTRACT_ADDRESS = address;
