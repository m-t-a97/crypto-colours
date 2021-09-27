import { Button } from '@mui/material';
import classnames from 'classnames';
import _ from 'lodash';
import Image from 'next/image';
import { fromWei } from 'web3-utils';

import SvgTooltipIcon from '@components/shared/SvgTooltipIcon/SvgTooltipIcon';

import { WalletAccountType } from '@src/context/blockchain/WalletAccountContextProvider';
import useWalletAccount from '@src/hooks/blockchain/useWalletAccount';
import MarketItemMapper from '@src/mappers/market/market-item.mapper';
import Colour from '@src/models/Colour.model';
import MarketItem from '@src/models/MarketItem.model';

import styles from './MarketItemDetails.module.scss';
import MarketItemDetailsLogic from './MarketItemDetailsLogic';

type MarketItemDetailsProps = {
  marketItem: MarketItem;
  colour: Colour;
  updateMarketItemWhenBought: (updatedMarketItem: MarketItem) => void;
};

const MarketItemDetails = ({
  marketItem,
  colour,
  updateMarketItemWhenBought,
}: MarketItemDetailsProps) => {
  const { account }: WalletAccountType = useWalletAccount();

  const { buyToken } = MarketItemDetailsLogic();

  const onBuyToken = async (): Promise<void> => {
    try {
      const purchasedMarketItemResult = await buyToken(marketItem.tokenId);
      const mappedUpdatedMarketItem: MarketItem = MarketItemMapper.transform(
        purchasedMarketItemResult.events.MarketItemPurchased.returnValues
      );
      updateMarketItemWhenBought(mappedUpdatedMarketItem);
    } catch (error) {
      console.error("[MarketItemDetails][onBuyToken]:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerInfoCard}>
        <h2 className="m-auto text-md font-bold">Overview</h2>
      </div>

      <div className={styles.colourInfoCard}>
        <div className="flex flex-col">
          <span className="mb-2 text-sm font-bold">ID</span>
          <span className="text-base">{colour.id}</span>
        </div>

        <div className="flex flex-col">
          <span className="mb-2 text-sm font-bold">Hex Code</span>
          <span className="text-base">{colour.hexCode}</span>
        </div>
      </div>

      <div
        className={classnames(styles.ownerCard, {
          "bg-yellow-500": !marketItem.sold,
          "bg-green-500": marketItem.sold,
        })}
      >
        {!marketItem.sold && <p className="text-md font-bold">Not Owned</p>}

        {marketItem.sold && (
          <div className="w-max flex flex-row justify-center items-center">
            <span className="text-xs inline-block mr-2">Owned by</span>

            <SvgTooltipIcon data={marketItem.owner} size={50} />
          </div>
        )}
      </div>

      <div className={styles.saleCard}>
        <div className={styles.saleHeader}>
          <h2 className="w-full m-auto text-center font-bold">Sale</h2>
        </div>

        <div className="w-full p-4">
          {!marketItem.sold && (
            <p className="mb-2 text-base font-bold text-gray-500">
              Current Price
            </p>
          )}
          {marketItem.sold && (
            <p className="mb-2 text-base text-gray-500">Sold for</p>
          )}

          <div className="flex flex-row">
            <div className="mr-2 flex flex-col justify-center items-center">
              <Image
                src="/icons/ethereum-icon.svg"
                alt="Ethereum Icon"
                height={20}
                width={20}
              />
            </div>

            <span className="text-lg font-bold">
              {fromWei(marketItem.price.toString(), "ether")}
            </span>
          </div>
        </div>

        <hr className="w-full border border-solid border-gray-200" />

        <div className="w-full p-4">
          <p className="mb-2 text-base font-bold text-gray-500">Seller</p>

          <SvgTooltipIcon data={marketItem.seller} size={50} />
        </div>

        {!marketItem.sold && !_.isEqual(account, marketItem.seller) && (
          <div className="mt-2 mb-4">
            <Button variant="contained" onClick={onBuyToken}>
              BUY NOW
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketItemDetails;
