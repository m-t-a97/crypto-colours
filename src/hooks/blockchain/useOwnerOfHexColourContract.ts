import { useEffect, useState } from 'react';

import { ContractsContextType } from '@src/context/blockchain/ContractsContextProvider';
import { WalletAccountType } from '@src/context/blockchain/WalletAccountContextProvider';

import useContracts from './useContracts';
import useWalletAccount from './useWalletAccount';

const useOwnerOfHexColourContract = () => {
  const { account }: WalletAccountType = useWalletAccount();
  const { hexColourContractService }: ContractsContextType = useContracts();

  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    checkIfOwner();
  }, [account]);

  const checkIfOwner = async () => {
    try {
      const isOwner = await hexColourContractService.isOwner(account);
      setIsOwner(isOwner);
    } catch (error) {
      console.error("[Navbar][checkIfOwner]:", error);
    }
  };

  return {
    isOwner,
  };
};

export default useOwnerOfHexColourContract;
