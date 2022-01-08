import { ContractsContextType } from '@src/context/blockchain/ContractsContextProvider';
import { WalletAccountType } from '@src/context/blockchain/WalletAccountContextProvider';
import useContracts from '@src/hooks/blockchain/useContracts';
import useWalletAccount from '@src/hooks/blockchain/useWalletAccount';
import MarketItem from '@src/models/MarketItem.model';

const MarketItemRelistCardLogic = () => {
  const { account }: WalletAccountType = useWalletAccount();

  const {
    hexColourContractService,
    nftMarketPlaceContractService,
  }: ContractsContextType = useContracts();

  const relistTokenForSale = async (
    marketItem: MarketItem,
    price: number
  ): Promise<any> => {
    try {
      await hexColourContractService.approve(
        nftMarketPlaceContractService.address,
        marketItem.tokenId.toString(),
        account
      );

      return nftMarketPlaceContractService.relistMarketItem(
        marketItem.itemId,
        price,
        account
      );
    } catch (error) {
      console.error("[MarketItemRelistCardLogic][relistTokenForSale]:", error);

      return Promise.reject(error);
    }
  };

  return { relistTokenForSale };
};

export default MarketItemRelistCardLogic;
