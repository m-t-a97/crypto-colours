import _ from 'lodash';
import { toWei } from 'web3-utils';

import MarketItemMapper from '@src/mappers/market/market-item.mapper';
import MarketItem from '@src/models/MarketItem.model';

import { HEX_COLOUR_CONTRACT_ADDRESS, NFT_MARKET_PLACE_CONTRACT_ABI, NFT_MARKET_PLACE_CONTRACT_ADDRESS } from '../data/contracts';
import { Web3Service } from '../web3/web3.service';

export class NFTMarketPlaceContractService {
  private readonly contract: any;

  constructor() {
    this.contract = new Web3Service.web3Instance.eth.Contract(
      NFT_MARKET_PLACE_CONTRACT_ABI as any,
      NFT_MARKET_PLACE_CONTRACT_ADDRESS
    );
  }

  public async createMarketItem(
    tokenId: number,
    price: number,
    userAccount: string
  ): Promise<any> {
    return this.contract.methods
      .createMarketItem(
        HEX_COLOUR_CONTRACT_ADDRESS,
        tokenId,
        toWei(price.toString(), "ether")
      )
      .send({ from: userAccount, value: await this.getListingPrice() });
  }

  public async purchaseMarketItem(
    tokenId: number,
    userAccount: string
  ): Promise<any> {
    const unsoldMarketItems: MarketItem[] = await this.fetchUnsoldMarketItems();

    let marketItemToPurchase: MarketItem;

    for (let i = 0; i < unsoldMarketItems.length; i++) {
      const currentMarketItem = unsoldMarketItems[i];

      if (_.isEqual(currentMarketItem.tokenId, tokenId)) {
        marketItemToPurchase = currentMarketItem;
        break;
      }
    }

    return this.contract.methods
      .purchaseMarketItem(HEX_COLOUR_CONTRACT_ADDRESS, tokenId)
      .send({ from: userAccount, value: marketItemToPurchase.price });
  }

  public async getListingPrice(): Promise<number> {
    return this.contract.methods.getListingPrice().call();
  }

  public async fetchMarketItem(itemId: number): Promise<MarketItem> {
    return this.contract.methods
      .fetchMarketItem(itemId)
      .call()
      .then((marketItem: MarketItem) => MarketItemMapper.transform(marketItem));
  }

  public async fetchUnsoldMarketItems(): Promise<MarketItem[]> {
    return this.contract.methods
      .fetchUnsoldMarketItems()
      .call()
      .then((marketItems: MarketItem[]) =>
        marketItems.map((marketItem: MarketItem) =>
          MarketItemMapper.transform(marketItem)
        )
      );
  }

  public async fetchSoldMarketItems(): Promise<MarketItem[]> {
    return this.contract.methods
      .fetchSoldMarketItems()
      .call()
      .then((marketItems: MarketItem[]) =>
        marketItems.map((marketItem: MarketItem) =>
          MarketItemMapper.transform(marketItem)
        )
      );
  }

  public async fetchNFTsOfOwner(userAccount: string): Promise<MarketItem[]> {
    return this.contract.methods
      .fetchNFTsOfOwner()
      .call({ from: userAccount })
      .then((marketItems: MarketItem[]) =>
        marketItems.map((marketItem: MarketItem) =>
          MarketItemMapper.transform(marketItem)
        )
      );
  }

  public async fetchItemsCreatedBySeller(
    userAccount: string
  ): Promise<MarketItem[]> {
    return this.contract.methods
      .fetchItemsCreatedBySeller()
      .call({ from: userAccount })
      .then((marketItems: MarketItem[]) =>
        marketItems.map((marketItem: MarketItem) =>
          MarketItemMapper.transform(marketItem)
        )
      );
  }
}
