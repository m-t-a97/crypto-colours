import { useContext } from 'react';

import { ContractsContext } from '@src/context/blockchain/ContractsContextProvider';

const useContracts = () => {
  return useContext(ContractsContext);
};

export default useContracts;
