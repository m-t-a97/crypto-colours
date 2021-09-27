interface MarketItem {
  itemId: number;
  nftContractAddress: string;
  tokenId: number;
  seller: string;
  owner: string;
  price: number;
  sold: boolean;
}

export default MarketItem;
