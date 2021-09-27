import { ContractsContextType } from '@src/context/blockchain/ContractsContextProvider';
import { WalletAccountType } from '@src/context/blockchain/WalletAccountContextProvider';
import useContracts from '@src/hooks/blockchain/useContracts';
import useWalletAccount from '@src/hooks/blockchain/useWalletAccount';

const MarketItemDetailsLogic = () => {
  const { account }: WalletAccountType = useWalletAccount();

  const { nftMarketPlaceContractService }: ContractsContextType =
    useContracts();

  const buyToken = async (tokenId: number): Promise<any> => {
    return nftMarketPlaceContractService.purchaseMarketItem(tokenId, account);
  };

  return { buyToken };
};

export default MarketItemDetailsLogic;
