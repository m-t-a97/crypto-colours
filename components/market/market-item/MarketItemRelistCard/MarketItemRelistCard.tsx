import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button, CircularProgress, TextField } from '@mui/material';

import MarketItemMapper from '@src/mappers/market/market-item.mapper';
import MarketItem from '@src/models/MarketItem.model';

import styles from './MarketItemRelistCard.module.scss';
import MarketItemRelistCardLogic from './MarketItemRelistCardLogic';

type MarketItemRelistCardProps = {
  marketItem: MarketItem;
  updateMarketItem: (updatedMarketItem: MarketItem) => void;
};

type RelistTokenFormData = {
  price: number;
};

const MarketItemRelistCard = ({
  marketItem,
  updateMarketItem,
}: MarketItemRelistCardProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<RelistTokenFormData>({
    mode: "onChange",
    defaultValues: {
      price: 0,
    },
  });

  const { relistTokenForSale } = MarketItemRelistCardLogic();

  const [enabledRelistingOfToken, setEnabledRelistingOfToken] =
    useState<boolean>(false);
  const [isRelisting, setIsRelisting] = useState<boolean>(false);

  const onRelistTokenForSale = async (
    data: RelistTokenFormData
  ): Promise<void> => {
    try {
      setIsRelisting(true);
      const relistedMarketItem = await relistTokenForSale(
        marketItem,
        data.price
      );
      const mappedUpdatedMarketItem: MarketItem = MarketItemMapper.transform(
        relistedMarketItem.events.MarketItemRelisted.returnValues
      );
      updateMarketItem(mappedUpdatedMarketItem);
    } catch (error) {
      console.error("[MarketItemRelistCard][onRelistTokenForSale]:", error);
      setIsRelisting(false);
    }
  };

  const onEnableRelistingOfToken = (): void => {
    setEnabledRelistingOfToken(true);
  };

  return (
    <div className={styles.container}>
      {!enabledRelistingOfToken && (
        <Button
          type="button"
          variant="outlined"
          color="primary"
          onClick={onEnableRelistingOfToken}
        >
          RELIST FOR SALE
        </Button>
      )}

      {enabledRelistingOfToken && (
        <form>
          <div className={styles.textFieldContainer}>
            <label className={styles.textFieldLabel}>New Price:</label>

            <Controller
              name="price"
              control={control}
              rules={{
                required: true,
                shouldUnregister: true,
              }}
              render={({ field }) => (
                <TextField variant="outlined" {...field} />
              )}
            />

            <Button
              type="submit"
              variant="outlined"
              color="primary"
              className="mt-4"
              disabled={isRelisting || !isValid}
              onClick={handleSubmit(onRelistTokenForSale)}
            >
              {isRelisting ? (
                <CircularProgress size={25} />
              ) : (
                <span>RELIST</span>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MarketItemRelistCard;
