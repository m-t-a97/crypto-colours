import { createContext } from 'react';

import { HexColourContractService } from '@src/services/contracts/hex-colour-contract.service';
import { NFTMarketPlaceContractService } from '@src/services/contracts/nft-market-place-contract.service';

export type ContractsContextType = {
  nftMarketPlaceContractService: NFTMarketPlaceContractService;
  hexColourContractService: HexColourContractService;
};

export const ContractsContext = createContext<ContractsContextType>(null);

const ContractsContextProvider = ({ children }) => {
  const value: ContractsContextType = {
    nftMarketPlaceContractService: new NFTMarketPlaceContractService(),
    hexColourContractService: new HexColourContractService(),
  };

  return (
    <ContractsContext.Provider value={value}>
      {children}
    </ContractsContext.Provider>
  );
};

export default ContractsContextProvider;
