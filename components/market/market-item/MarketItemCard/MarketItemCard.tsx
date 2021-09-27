import { useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';
import _ from 'lodash';
import Image from 'next/image';
import { fromWei } from 'web3-utils';

import SvgTooltipIcon from '@components/shared/SvgTooltipIcon/SvgTooltipIcon';

import useContracts from '@src/hooks/blockchain/useContracts';
import Colour from '@src/models/Colour.model';
import MarketItem from '@src/models/MarketItem.model';

import styles from './MarketItemCard.module.scss';

type MarketItemCardProps = {
  marketItem: MarketItem;
};

const MarketItemCard = ({ marketItem }: MarketItemCardProps) => {
  const { hexColourService } = useContracts();

  const [colour, setColour] = useState<Colour>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const colour: Colour = await hexColourService.fetchColour(
        marketItem.tokenId
      );

      if (!_.isNil(colour)) {
        setColour(colour);
      }

      setIsLoading(false);
    })();
  }, []);

  return isLoading ? (
    <div className="h-full w-full flex flex-row justify-center items-center">
      <CircularProgress />
    </div>
  ) : (
    !_.isNil(colour) && (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className="text-lg font-bold">{marketItem.itemId}</span>
          <span className="text-lg font-bold">{colour.hexCode}</span>
        </div>

        <div className={styles.content}>
          <div
            style={{ backgroundColor: colour.hexCode }}
            className={styles.colourCircle}
          ></div>
        </div>

        <div className={styles.footer}>
          <div className={styles.infoRow}>
            <span className="text-base font-bold">Seller:</span>

            <span>
              <SvgTooltipIcon data={marketItem.seller} size={50} />
            </span>
          </div>

          <hr className="mt-2 mb-4 border border-solid border-gray-200" />

          <div className={styles.infoRow}>
            <span className="text-base font-bold">Price:</span>

            <span className="flex flex-row justify-center items-center">
              <Image
                src="/icons/ethereum-icon.svg"
                alt="Ethereum Icon"
                height={20}
                width={20}
              />

              <span className="text-base font-bold">
                {fromWei(marketItem.price.toString(), "ether")}
              </span>
            </span>
          </div>
        </div>
      </div>
    )
  );
};

export default MarketItemCard;
