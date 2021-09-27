// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./utils/Ownable.sol";
import "./utils/SafeMath.sol";

contract HexColour is ERC721Upgradeable, OwnableUpgradeable {
  using SafeMath for uint256;
  using Counters for Counters.Counter;

  bool private initialized;

  struct Colour {
    uint id;
    string hexCode;
  } 
  
  Counters.Counter private _idCounter;
  Colour[] public colours;

  address private _marketPlaceContractAddress;

  event ColourMinted(uint id, string hexCode);

  // Constructor for upgradeable contracts
  function initialize(address address_) public initializer {
    __ERC721_init("HexColour", "HEXC");
    __Ownable_init();
    require(!initialized, "Contract instance has already been initialized");
    initialized = true;
    _marketPlaceContractAddress = address_;
  }

  modifier onlyIfColourDoesntExist(string memory hexCode) {
    require(!doesColourExist(hexCode));
    _;
  }

  function doesColourExist(string memory hexCode) public view returns (bool) {
    if (colours.length > 0) {
      for (uint i = 0; i < colours.length; i++) {
        if (keccak256(abi.encodePacked(colours[i].hexCode)) == keccak256(abi.encodePacked(hexCode))) {
          return true;
        }
      }
    }

    return false;
  }

  function mint(string memory hexCode) public onlyIfColourDoesntExist(hexCode) {
    require(bytes(hexCode).length == 6, "The hex colour must be 6 characters in length.");
    
    _createColour(hexCode);
  }
  
  function _createColour(string memory hexCode) private {
    _idCounter.increment();
    uint id = _idCounter.current();
    colours.push(Colour(id, hexCode));
    _safeMint(msg.sender, id);
    setApprovalForAll(_marketPlaceContractAddress, true);
    emit ColourMinted(id, hexCode);
  }
}
