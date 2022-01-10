import _ from 'lodash';

import hexColourContractInfoAsJson from '@blockchain/build/contracts/HexColour.json';

let address: string = "";

if (!_.isEqual(process.env.NODE_ENV, "production")) {
  address = hexColourContractInfoAsJson.networks[5777].address;
} else {
  address = process.env.NEXT_PUBLIC_POLYGON_TESTNET_HEX_COLOUR_CONTRACT_ADDRESS;
}

export const HEX_COLOUR_CONTRACT_ABI = hexColourContractInfoAsJson.abi;
export const HEX_COLOUR_CONTRACT_ADDRESS = address;
