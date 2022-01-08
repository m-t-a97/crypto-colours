// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./HexColour.sol";

contract NFTMarketPlace is Initializable, ReentrancyGuardUpgradeable, OwnableUpgradeable, IERC721ReceiverUpgradeable {
  using Counters for Counters.Counter;

  bool private initialized;

  Counters.Counter private _itemIds;

  uint private _listingFee;

  struct MarketItem {
    uint itemId;
    address nftContractAddress;
    uint tokenId;
    address payable seller;
    address payable owner;
    uint price;
    bool sold;
  }

  mapping (uint => MarketItem) private _idToMarketItem;

  event MarketItemCreated(
    uint indexed itemId,
    address indexed nftContractAddress,
    uint indexed tokenId,
    address seller, 
    address owner,
    uint price,
    bool sold 
  );

  event MarketItemPurchased(
    uint indexed itemId,
    address indexed nftContractAddress,
    uint indexed tokenId,
    address seller, 
    address owner,
    uint price,
    bool sold 
  );

  event MarketItemRelisted(
    uint indexed itemId,
    address indexed nftContractAddress,
    uint indexed tokenId,
    address seller, 
    address owner,
    uint price,
    bool sold 
  );

  // Constructor for upgradeable contracts
  function initialize() public initializer {
    __ReentrancyGuard_init();
    __Ownable_init();
    require(!initialized, "Contract instance has already been initialized");
    initialized = true;
    _listingFee = 0.005 ether;
  }

  function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
    return this.onERC721Received.selector;
  }

  function updateListingFee(uint newListingFee) public onlyOwner {
    _listingFee = newListingFee;
  }

  function getListingFee() public view returns (uint) {
    return _listingFee;
  }

  modifier onlyIfPriceIsGreaterThanZero(uint price) {
    require(price > 0, "Price must be atleast 1 wei.");
    _;
  }

  modifier onlyIfListingFeeIsProvided() {
    require(msg.value == _listingFee, "You must pay the correct listing fee.");
    _;
  }

  function createMarketItem(address nftContractAddress, uint tokenId, uint price) public payable nonReentrant onlyIfPriceIsGreaterThanZero(price) onlyIfListingFeeIsProvided {
    _itemIds.increment();
    uint itemId = _itemIds.current();

    IERC721(nftContractAddress).safeTransferFrom(msg.sender, address(this), tokenId);

    _idToMarketItem[itemId] = MarketItem(
      itemId,
      nftContractAddress,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false
    );

    emit MarketItemCreated(
      itemId, 
      nftContractAddress, 
      tokenId, 
      msg.sender, 
      address(this), 
      price, 
      false
    );
  }

  function purchaseMarketItem(uint itemId) public payable nonReentrant {
    uint price = _idToMarketItem[itemId].price;
    require(msg.value == price, "You must pay the price of the listed item in order to purchase the token.");

    MarketItem storage itemToPurchase = _idToMarketItem[itemId];
    uint tokenId = itemToPurchase.tokenId;

    IERC721(itemToPurchase.nftContractAddress).safeTransferFrom(address(this), msg.sender, tokenId);
    itemToPurchase.seller.transfer(msg.value);
    itemToPurchase.owner = payable(msg.sender);
    itemToPurchase.sold = true;

    payable(owner()).transfer(_listingFee);

    emit MarketItemPurchased(
      itemId, 
      itemToPurchase.nftContractAddress, 
      tokenId, 
      itemToPurchase.seller, 
      msg.sender, 
      price, 
      true
    );
  }

  function relistMarketItem(uint itemId, uint newPrice) public payable onlyIfPriceIsGreaterThanZero(newPrice) onlyIfListingFeeIsProvided {
    MarketItem memory marketItemToRelist = fetchMarketItem(itemId);
    require(marketItemToRelist.sold == true, "This item cannot be relisted as it hasn't been sold yet.");

    IERC721(marketItemToRelist.nftContractAddress).safeTransferFrom(msg.sender, address(this), marketItemToRelist.tokenId);

    marketItemToRelist.seller = payable(msg.sender);
    marketItemToRelist.owner = payable(address(0));
    marketItemToRelist.price = newPrice;
    marketItemToRelist.sold = false;
    
    emit MarketItemRelisted(
      itemId, 
      marketItemToRelist.nftContractAddress, 
      marketItemToRelist.tokenId, 
      marketItemToRelist.seller, 
      marketItemToRelist.owner, 
      marketItemToRelist.price, 
      marketItemToRelist.sold
    );
  }

  function fetchMarketItem(uint itemId) public view returns (MarketItem memory) {
    uint totalItemCount = _itemIds.current();

    for (uint256 i = 1; i <= totalItemCount; i++) {
      if (_idToMarketItem[i].itemId == itemId) {
        return _idToMarketItem[i];
      }
    }

    revert("The market item with that id was not found.");
  }

  function fetchUnsoldMarketItems() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint unsoldItemCount = 0;

    for (uint256 i = 1; i <= totalItemCount; i++) {
      if (_idToMarketItem[i].owner == address(0)) {
        unsoldItemCount++;
      }
    }

    MarketItem[] memory unsoldItems = new MarketItem[](unsoldItemCount);
    uint currentIndex = 0;

    for (uint256 i = 1; i <= totalItemCount; i++) {
      if (_idToMarketItem[i].owner == address(0)) {
        uint currentId = _idToMarketItem[i].itemId;
        MarketItem storage currentItem = _idToMarketItem[currentId];
        unsoldItems[currentIndex] = currentItem;
        currentIndex++;
      }
    }

    return unsoldItems;
  }

  function fetchSoldMarketItems() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();

    uint soldItemCount = 0;

    for (uint256 i = 1; i <= totalItemCount; i++) {
      if (_idToMarketItem[i].owner != address(0)) {
        soldItemCount++;
      }
    }

    MarketItem[] memory soldItems = new MarketItem[](soldItemCount);
    uint currentIndex = 0;

    for (uint256 i = 1; i <= totalItemCount; i++) {
      if (_idToMarketItem[i].owner != address(0)) {
        uint currentId = _idToMarketItem[i].itemId;
        MarketItem storage currentItem = _idToMarketItem[currentId];
        soldItems[currentIndex] = currentItem;
        currentIndex++;
      }
    }

    return soldItems;
  }

  function fetchNFTsOfOwner() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint ownerItemCount = 0;

    for (uint256 i = 1; i <= totalItemCount; i++) {
      if(_idToMarketItem[i].owner == msg.sender) {
        ownerItemCount++;
      }
    }

    MarketItem[] memory items = new MarketItem[](ownerItemCount);

    uint currentIndex = 0;

    for (uint256 i = 1; i <= totalItemCount; i++) {
      uint currentId = _idToMarketItem[i].itemId;

      if (_idToMarketItem[currentId].owner == msg.sender) {
        MarketItem storage ownedItem = _idToMarketItem[currentId];
        items[currentIndex] = ownedItem;
        currentIndex++;
      }
    }

    return items;
  }

  function fetchItemsCreatedBySeller() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint sellerItemCount = 0;

    for (uint256 i = 1; i <= totalItemCount; i++) {
      if(_idToMarketItem[i].seller == msg.sender) {
        sellerItemCount++;
      }
    }

    MarketItem[] memory items = new MarketItem[](sellerItemCount);

    uint currentIndex = 0;

    for (uint256 i = 1; i <= totalItemCount; i++) {
      uint currentId = _idToMarketItem[i].itemId;
      MarketItem storage currentItem = _idToMarketItem[currentId];
      items[currentIndex] = currentItem;
      currentIndex++;
    }

    return items;
  }
}
