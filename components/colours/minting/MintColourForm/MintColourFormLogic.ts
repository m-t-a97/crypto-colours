import { ContractsContextType } from '@src/context/blockchain/ContractsContextProvider';
import { WalletAccountType } from '@src/context/blockchain/WalletAccountContextProvider';
import useContracts from '@src/hooks/blockchain/useContracts';
import useWalletAccount from '@src/hooks/blockchain/useWalletAccount';

export interface MintColourFormData {
  hexColourCode: string;
  price: number;
}

const MintColourFormLogic = () => {
  const { account }: WalletAccountType = useWalletAccount();

  const {
    hexColourContractService,
    nftMarketPlaceContractService,
  }: ContractsContextType = useContracts();

  const mintNewToken = async (data: MintColourFormData): Promise<any> => {
    if (data.price <= 0) {
      return Promise.reject({
        message: "The price must be greater than 0 Ether.",
      });
    }

    const colourMintedResult: any = await hexColourContractService.mint(
      data.hexColourCode.toUpperCase(),
      account
    );

    const colourMintedId: number = parseInt(
      colourMintedResult.events.ColourMinted.returnValues.id
    );

    await nftMarketPlaceContractService.createMarketItem(
      colourMintedId,
      data.price,
      account
    );

    return Promise.resolve();
  };

  return { mintNewToken };
};

export default MintColourFormLogic;
