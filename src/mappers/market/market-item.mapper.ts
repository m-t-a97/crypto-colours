import MarketItem from '@src/models/MarketItem.model';

class MarketItemMapper {
  public static transform(data: Record<string, any>): MarketItem {
    return {
      itemId: parseInt(data.itemId),
      nftContractAddress: data.nftContractAddress,
      tokenId: parseInt(data.tokenId),
      seller: data.seller,
      owner: data.owner,
      price: data.price,
      sold: data.sold,
    };
  }
}

export default MarketItemMapper;
