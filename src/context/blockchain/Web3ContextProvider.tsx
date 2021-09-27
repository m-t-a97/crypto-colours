import { createContext, useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';
import Web3 from 'web3';

import { Web3Service } from '@src/services/web3/web3.service';

export type Web3ContextType = {
  web3: Web3;
};

export const Web3Context = createContext<Web3ContextType>(null);

const Web3ContextProvider = ({ children }) => {
  const [web3, setWeb3] = useState<Web3>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isErrorEncountered, setIsErrorEncountered] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setIsErrorEncountered(false);

    (async () => {
      try {
        const newWeb3 = await Web3Service.getWeb3();
        setWeb3(newWeb3);
        setIsLoading(false);
      } catch (error) {
        setIsErrorEncountered(true);
        setIsLoading(false);
      }
    })();
  }, []);

  const renderUI = (): JSX.Element => {
    if (isLoading) {
      return (
        <div className="h-full w-full flex flex-row justify-center items-center">
          <CircularProgress />
        </div>
      );
    } else if (!isLoading && isErrorEncountered) {
      return (
        <div className="h-full w-full flex flex-row justify-center items-center font-bold text-2xl text-white">
          Please connect your metamask wallet to the app and refresh...
        </div>
      );
    } else if (!isLoading && !isErrorEncountered) {
      const value: Web3ContextType = {
        web3,
      };

      return (
        <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
      );
    }
  };

  return renderUI();
};

export default Web3ContextProvider;
