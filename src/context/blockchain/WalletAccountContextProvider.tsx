import { createContext, useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';
import _ from 'lodash';
import { interval, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import Web3 from 'web3';

import { Web3Service } from '@src/services/web3/web3.service';

export type WalletAccountType = {
  account: string;
};

export const WalletAccountContext = createContext<WalletAccountType>(null);

let accounts_$: Subscription;

const WalletAccountContextProvider = ({ children }) => {
  const [account, setAccount] = useState<string>(null);

  useEffect(() => {
    (async () => {
      try {
        const web3: Web3 = Web3Service.web3Instance;

        accounts_$ = interval(1000)
          .pipe(
            tap(async () => {
              const accounts: string[] = await web3.eth.getAccounts();

              if (!_.isEqual(account, accounts[0])) {
                setAccount(accounts[0]);
              }
            })
          )
          .subscribe();
      } catch (error) {
        console.error("[WalletAccountContextProvider][useEffect]:", error);
      }
    })();

    return () => {
      accounts_$?.unsubscribe();
    };
  }, [account]);

  const value: WalletAccountType = {
    account,
  };

  return !_.isNil(account) ? (
    <WalletAccountContext.Provider value={value}>
      {children}
    </WalletAccountContext.Provider>
  ) : (
    <div className="h-full w-full flex flex-row justify-center items-center">
      <CircularProgress />
    </div>
  );
};

export default WalletAccountContextProvider;
