import Colour from '@src/models/Colour.model';

import styles from './MarketItemSummary.module.scss';

type MarketItemSummaryProps = {
  colour: Colour;
};

const MarketItemSummary = ({ colour }: MarketItemSummaryProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <div className={styles.header}>Colour Preview</div>

        <div
          style={{ backgroundColor: colour.hexCode }}
          className={styles.colourCircle}
        ></div>
      </div>
    </div>
  );
};

export default MarketItemSummary;
