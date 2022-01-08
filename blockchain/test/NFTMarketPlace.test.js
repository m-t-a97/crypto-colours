const assert = require("assert");
const web3 = require("web3");

const NFTMarketPlace = artifacts.require("NFTMarketPlace.sol");
const HexColour = artifacts.require("HexColour.sol");

contract("NFTMarketPlace", (accounts) => {
  let nftMarketPlaceContract = null;
  let nftContract = null;

  beforeEach(async () => {
    nftMarketPlaceContract = await NFTMarketPlace.deployed();
    nftContract = await HexColour.deployed(nftMarketPlaceContract.address);
  });

  describe("Deployment", () => {
    it("should deploy successfully", async () => {
      const addresses = [nftMarketPlaceContract.address, nftContract.address];

      addresses.forEach((address) => {
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
      });
    });
  });

  describe("Listing Fee", () => {
    it("should test that the initial listing fee is 0.005 ether", async () => {
      const listingFee = await nftMarketPlaceContract.getListingFee();

      assert.equal(
        listingFee.toString(),
        web3.utils.toWei("0.005", "ether"),
        "expected listing fee was incorrect."
      );
    });

    it("should update the listing fee to 0.006 ether", async () => {
      const currentListingFee = await nftMarketPlaceContract.getListingFee();

      const newListingFee = web3.utils.toWei("0.006", "ether");

      await nftMarketPlaceContract.updateListingFee(newListingFee);

      const updatedListingFee = await nftMarketPlaceContract.getListingFee();

      assert.equal(
        currentListingFee.toString(),
        web3.utils.toWei("0.005", "ether"),
        "expected current listing fee was incorrect."
      );

      assert.equal(
        updatedListingFee.toString(),
        web3.utils.toWei("0.006", "ether"),
        "expected updated listing fee was incorrect."
      );
    });
  });

  describe("Interacting with the Market", () => {
    it("should test that there are no market items listed initially", async () => {
      const marketItems = await nftMarketPlaceContract.fetchUnsoldMarketItems();

      assert.equal(
        marketItems,
        0,
        "expected length of market items was incorrect"
      );
    });

    it("should be able to create a new market item", async () => {
      await nftContract.mint("FFFFFF", { from: accounts[0] });
      const colourMinted = await nftContract.colours(0);
      const newItemPrice = web3.utils.toWei("1", "ether");
      const listingFee = await nftMarketPlaceContract.getListingFee();

      const marketItemCreatedResult =
        await nftMarketPlaceContract.createMarketItem(
          nftContract.address,
          colourMinted.id,
          newItemPrice,
          { from: accounts[0], value: listingFee }
        );

      const marketItems = await nftMarketPlaceContract.fetchUnsoldMarketItems();

      const itemId = marketItemCreatedResult.logs[0].args.itemId;
      const nftContractAddress =
        marketItemCreatedResult.logs[0].args.nftContractAddress;
      const tokenId = marketItemCreatedResult.logs[0].args.tokenId;
      const seller = marketItemCreatedResult.logs[0].args.seller;
      const owner = marketItemCreatedResult.logs[0].args.owner;
      const price = marketItemCreatedResult.logs[0].args.price;
      const sold = marketItemCreatedResult.logs[0].args.sold;

      assert.equal(
        marketItems.length,
        1,
        "expected length of market items was incorrect"
      );
      assert.equal(itemId, 1, "item id was incorrect");
      assert.equal(
        nftContractAddress,
        nftContract.address,
        "nft contract address was incorrect"
      );
      assert.equal(tokenId, 1, "token id was incorrect");
      assert.equal(seller, accounts[0], "seller was incorrect");
      assert.equal(
        owner,
        nftMarketPlaceContract.address,
        "owner was incorrect"
      );
      assert.equal(
        price,
        web3.utils.toWei("1", "ether"),
        "price was incorrect"
      );
      assert.equal(sold, false, "sold was incorrect");
    });

    it("should be able to fetch a market item", async () => {
      const marketItem = await nftMarketPlaceContract.fetchMarketItem(1);

      assert.equal(marketItem.itemId, 1, "expected item id was incorrect.");
      assert.equal(marketItem.tokenId, 1, "expected token id was incorrect.");
    });

    it("should be able to fetch unsold market items", async () => {
      const unsoldMarketItems =
        await nftMarketPlaceContract.fetchUnsoldMarketItems();

      assert.equal(
        unsoldMarketItems.length,
        1,
        "expected unsold market items length was incorrect."
      );
    });

    it("should be able to purchase a market item.", async () => {
      const itemPrice = web3.utils.toWei("1", "ether");

      await nftMarketPlaceContract.purchaseMarketItem(1, {
        from: accounts[1],
        value: itemPrice,
      });

      const soldMarketItems =
        await nftMarketPlaceContract.fetchSoldMarketItems();

      const marketItemPurchased = soldMarketItems[0];

      assert.equal(
        soldMarketItems.length,
        1,
        "The number of expected market items sold was incorrect."
      );
      assert.equal(
        marketItemPurchased.itemId,
        1,
        "expected itemId is incorrect."
      );
      assert.equal(
        marketItemPurchased.nftContractAddress,
        nftContract.address,
        "expected nftContractAddress is incorrect."
      );
      assert.equal(
        marketItemPurchased.tokenId,
        1,
        "expected tokenId is incorrect."
      );
      assert.equal(
        marketItemPurchased.seller,
        accounts[0],
        "expected seller of the purchased market item is incorrect."
      );
      assert.equal(
        marketItemPurchased.owner,
        accounts[1],
        "expected owner of the purchased market item is incorrect."
      );
      assert.equal(
        marketItemPurchased.price,
        web3.utils.toWei("1", "ether"),
        "expected price is incorrect."
      );
      assert.equal(
        marketItemPurchased.sold,
        true,
        "expected sold of the purchased market item is incorrect."
      );
    });

    it("should be able to fetch sold market items", async () => {
      const soldMarketItems =
        await nftMarketPlaceContract.fetchSoldMarketItems();

      assert.equal(
        soldMarketItems.length,
        1,
        "expected sold market items length was incorrect."
      );
    });

    it("should test fetching NFTs of an owner", async () => {
      const ownersNftItems = await nftMarketPlaceContract.fetchNFTsOfOwner({
        from: accounts[1],
      });

      assert.equal(
        ownersNftItems.length,
        1,
        "expected length of owners nft items was incorrect."
      );
    });

    it("should test fetching NFTs created by a seller", async () => {
      const sellersNftItems =
        await nftMarketPlaceContract.fetchItemsCreatedBySeller({
          from: accounts[0],
        });

      assert.equal(
        sellersNftItems.length,
        1,
        "expected length of sellers nft items was incorrect."
      );
    });

    it("should test relisting purchased NFT", async () => {
      const newPrice = web3.utils.toWei("2", "ether");
      const listingFee = await nftMarketPlaceContract.getListingFee();

      await nftContract.approve(nftMarketPlaceContract.address, 1, {
        from: accounts[1],
      });

      const result = await nftMarketPlaceContract.relistMarketItem(
        1,
        newPrice,
        { from: accounts[1], value: listingFee }
      );

      const marketItemRelistedResult = result.logs[0].args;

      assert.equal(
        marketItemRelistedResult.itemId,
        1,
        "expected itemId was incorrect."
      );
      assert.equal(
        marketItemRelistedResult.nftContractAddress,
        nftContract.address,
        "expected nftContract address was incorrect."
      );
      assert.equal(
        marketItemRelistedResult.tokenId,
        1,
        "expected tokenId was incorrect."
      );
      assert.equal(
        marketItemRelistedResult.seller,
        accounts[1],
        "expected seller address was incorrect."
      );
      assert.equal(
        marketItemRelistedResult.owner,
        0x0,
        "expected owner address was incorrect."
      );
      assert.equal(
        marketItemRelistedResult.price,
        web3.utils.toWei("2", "ether"),
        "expected price was incorrect."
      );
      assert.equal(
        marketItemRelistedResult.sold,
        false,
        "expected sold was incorrect."
      );
    });

    it("should test purchasing a token after it is relisted by another user", async () => {
      const itemPrice = web3.utils.toWei("2", "ether");

      await nftMarketPlaceContract.purchaseMarketItem(1, {
        from: accounts[2],
        value: itemPrice,
      });

      const soldMarketItems =
        await nftMarketPlaceContract.fetchSoldMarketItems();

      const marketItemPurchased = soldMarketItems[0];

      assert.equal(
        soldMarketItems.length,
        1,
        "The number of expected market items sold was incorrect."
      );
      assert.equal(
        marketItemPurchased.itemId,
        1,
        "expected itemId is incorrect."
      );
      assert.equal(
        marketItemPurchased.nftContractAddress,
        nftContract.address,
        "expected nftContractAddress is incorrect."
      );
      assert.equal(
        marketItemPurchased.tokenId,
        1,
        "expected tokenId is incorrect."
      );
      assert.equal(
        marketItemPurchased.seller,
        accounts[1],
        "expected seller of the purchased market item is incorrect."
      );
      assert.equal(
        marketItemPurchased.owner,
        accounts[2],
        "expected owner of the purchased market item is incorrect."
      );
      assert.equal(
        marketItemPurchased.price,
        web3.utils.toWei("2", "ether"),
        "expected price is incorrect."
      );
      assert.equal(
        marketItemPurchased.sold,
        true,
        "expected sold of the purchased market item is incorrect."
      );
    });
  });
});
