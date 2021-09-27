import { useContext } from 'react';

import { WalletAccountContext } from '@src/context/blockchain/WalletAccountContextProvider';

const useWalletAccount = () => {
  return useContext(WalletAccountContext);
};

export default useWalletAccount;
