import { useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';
import _ from 'lodash';
import Head from 'next/head';
import { NextRouter, useRouter } from 'next/router';

import HomeLayout from '@components/layouts/HomeLayout';
import MarketItemDetails from '@components/market/market-item/MarketItemDetails/MarketItemDetails';
import MarketItemSummary from '@components/market/market-item/MarketItemSummary/MarketItemSummary';

import { ContractsContextType } from '@src/context/blockchain/ContractsContextProvider';
import useContracts from '@src/hooks/blockchain/useContracts';
import Colour from '@src/models/Colour.model';
import MarketItem from '@src/models/MarketItem.model';

import styles from './MarketItemPage.module.scss';

const MarketItemPage = () => {
  const router: NextRouter = useRouter();
  const { id } = router.query;

  const {
    nftMarketPlaceContractService,
    hexColourService,
  }: ContractsContextType = useContracts();

  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [marketItem, setMarketItem] = useState<MarketItem>(null);
  const [colour, setColour] = useState<Colour>(null);

  useEffect(() => {
    (async () => {
      setIsLoadingData(true);

      const marketItemFetched: MarketItem =
        await nftMarketPlaceContractService.fetchMarketItem(
          parseInt(id as string)
        );
      setMarketItem(marketItemFetched);

      const marketItemColour = await hexColourService.fetchColour(
        marketItemFetched.tokenId
      );
      setColour(marketItemColour);

      setIsLoadingData(false);
    })();
  }, []);

  const updateMarketItemWhenBought = (updatedMarketItem: MarketItem): void => {
    setMarketItem((previousState) => ({
      ...previousState,
      ...updatedMarketItem,
    }));
  };

  return isLoadingData ? (
    <div className="h-full w-full flex flex-row justify-center items-center">
      <CircularProgress />
    </div>
  ) : (
    !_.isNil(marketItem) && (
      <div className={styles.container}>
        <Head>
          <title>{process.env.NEXT_PUBLIC_APP_NAME} - Market Item</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={styles.innerContainer}>
          <div className={styles.summaryWrapper}>
            <MarketItemSummary colour={colour} />
          </div>

          <div className={styles.detailsWrapper}>
            <MarketItemDetails
              marketItem={marketItem}
              colour={colour}
              updateMarketItemWhenBought={updateMarketItemWhenBought}
            />
          </div>
        </div>
      </div>
    )
  );
};

MarketItemPage.Layout = HomeLayout;

export default MarketItemPage;
