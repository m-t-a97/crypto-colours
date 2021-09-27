import { useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';
import _ from 'lodash';
import Head from 'next/head';

import HomeLayout from '@components/layouts/HomeLayout';
import MarketItemList from '@components/market/market-item/MarketItemList/MarketItemList';

import useContracts from '@src/hooks/blockchain/useContracts';
import MarketItem from '@src/models/MarketItem.model';

const MarketPlaceDashboard = () => {
  const { nftMarketPlaceContractService } = useContracts();

  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [unsoldMarketItems, setUnsoldMarketItems] = useState<MarketItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoadingData(true);

        const unsoldMarketItems =
          await nftMarketPlaceContractService.fetchUnsoldMarketItems();

        setUnsoldMarketItems(unsoldMarketItems);
        setIsLoadingData(false);
      } catch (error) {
        console.error("[MarketItemListLogic][useEffect]:", error);
        setIsLoadingData(false);
      }
    })();
  }, []);

  return (
    <div className="p-4">
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Market Place</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="mb-12 text-3xl font-bold text-white text-center">
        Market Place
      </h1>

      {isLoadingData && (
        <div className="flex flex-row justify-center items-center">
          <CircularProgress />
        </div>
      )}

      {!isLoadingData && _.isEmpty(unsoldMarketItems) && (
        <p className="m-auto w-auto text-center text-base font-bold text-white">
          There are currently no NFTs that have been listed...
        </p>
      )}

      {!isLoadingData && !_.isEmpty(unsoldMarketItems) && (
        <MarketItemList marketItems={unsoldMarketItems} />
      )}
    </div>
  );
};

MarketPlaceDashboard.Layout = HomeLayout;

export default MarketPlaceDashboard;
