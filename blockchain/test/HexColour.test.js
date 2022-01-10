const HexColour = artifacts.require("HexColour.sol");

contract("HexColour", (accounts) => {
  let contract = null;

  beforeEach(async () => {
    contract = await HexColour.deployed();
  });

  describe("Deployment", () => {
    it("should deploy successfully", async () => {
      const address = contract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("should have the name 'HexColour'", async () => {
      const name = await contract.name();
      assert.equal(name, "HexColour");
    });

    it("should have the symbol 'HEXC'", async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, "HEXC");
    });
  });

  describe("Minting", () => {
    it("should not contain any colours initially", async () => {
      const colours = contract.colours;
      assert.equal(colours.length, 0);
    });

    it("should successfully create a new colour token with colour FFFFFF", async () => {
      const result = await contract.mint("FFFFFF");
      const colour = await contract.colours(0);
      const event = result.logs[0].args;

      assert.equal(colour.hexCode, "FFFFFF", "expected hexCode is incorrect");
      assert.equal(
        event.from,
        "0x0000000000000000000000000000000000000000",
        "expected 'from' address is incorrect"
      );
      assert.equal(event.to, accounts[0], "expected 'to' address is incorrect");
    });

    it("should fail when trying to mint the same colour", async () => {
      try {
        await contract.mint("FFFFFF");
        await contract.mint("FFFFFF");
      } catch (error) {
        assert.equal(
          error.message,
          "Returned error: VM Exception while processing transaction: revert",
          "The error message for trying to mint the same colour was not correct."
        );
      }
    });
  });
});
