import Link from 'next/link';

import RoutePaths from '@src/constants/route-paths';
import MarketItem from '@src/models/MarketItem.model';

import MarketItemCard from '../MarketItemCard/MarketItemCard';
import styles from './MarketItemList.module.scss';

type MarketItemListProps = {
  marketItems: MarketItem[];
};

const MarketItemList = ({ marketItems }: MarketItemListProps) => {
  return (
    <div className={styles.container}>
      {marketItems.map((item: MarketItem) => (
        <Link
          key={item.itemId}
          href={`${RoutePaths.MARKET_ITEM}/${item.itemId}`}
        >
          <a className={styles.cardLinkAnchor}>
            <MarketItemCard marketItem={item} />
          </a>
        </Link>
      ))}
    </div>
  );
};

export default MarketItemList;
