import { useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';
import _ from 'lodash';
import Head from 'next/head';

import HomeLayout from '@components/layouts/HomeLayout';
import MarketItemList from '@components/market/market-item/MarketItemList/MarketItemList';

import { ContractsContextType } from '@src/context/blockchain/ContractsContextProvider';
import { WalletAccountType } from '@src/context/blockchain/WalletAccountContextProvider';
import useContracts from '@src/hooks/blockchain/useContracts';
import useWalletAccount from '@src/hooks/blockchain/useWalletAccount';
import MarketItem from '@src/models/MarketItem.model';

const MyColoursDashboard = () => {
  const { account }: WalletAccountType = useWalletAccount();

  const { nftMarketPlaceContractService }: ContractsContextType =
    useContracts();

  const [ownedMarketItems, setOwnedMarketItems] = useState<MarketItem[]>(null);

  useEffect(() => {
    (async () => {
      await fetchOwnedMarketItems();
    })();
  }, [account]);

  const fetchOwnedMarketItems = async (): Promise<void> => {
    try {
      const marketItemsOwned: MarketItem[] =
        await nftMarketPlaceContractService.fetchNFTsOfOwner(account);

      setOwnedMarketItems(marketItemsOwned);
    } catch (error) {
      console.error("[MyColoursDashboard][loadColours]", error);
    }
  };

  return (
    <div className="m-auto p-4">
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - My Colours</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="mb-8 text-3xl font-bold text-white text-center">
        My Colours
      </h1>

      {_.isNil(ownedMarketItems) && (
        <div className="flex flex-row justify-center items-center">
          <CircularProgress />
        </div>
      )}

      {!_.isNil(ownedMarketItems) && _.isEmpty(ownedMarketItems) && (
        <div className="flex flex-row justify-center items-center text-lg font-bold text-white">
          You do not own any colour tokens...
        </div>
      )}

      {!_.isNil(ownedMarketItems) && !_.isEmpty(ownedMarketItems) && (
        <MarketItemList marketItems={ownedMarketItems} />
      )}
    </div>
  );
};

MyColoursDashboard.Layout = HomeLayout;

export default MyColoursDashboard;
