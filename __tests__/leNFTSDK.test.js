const leNFT = require("../leNFTSDK.js");
const ethers = require("ethers");

describe("leNFTSDK", () => {
  let sdk;
  let provider;

  beforeEach(() => {
    // Setup
    provider = ethers.getDefaultProvider();
    sdk = new leNFT(provider);
  });

  it("gets correct pool", async () => {
    const nft = "0x29827476090a083cfFd9E5D8B48a5b6A3C37c1FF";
    const token = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const expectedPool = "0xb2FD99528Ce8f7a6AecFC24c286e63E9D19f06F1";

    const pool = await sdk.getPool(nft, token);

    expect(pool).toBe(expectedPool);
  }, 10000);

  it("gets pool NFTs correctly", async () => {
    const pool = "0xb2FD99528Ce8f7a6AecFC24c286e63E9D19f06F1";
    const nfts = await sdk.getPoolNFTs(pool);

    expect(Array.isArray(nfts)).toBeTruthy();
  }, 20000);

  it("gets NFTLP correctly", async () => {
    const pool = "0xb2FD99528Ce8f7a6AecFC24c286e63E9D19f06F1";
    const nfts = await sdk.getPoolNFTs(pool);
    const nftId = nfts[0].tokenId;

    const nftLP = await sdk.getNFTLP(pool, nftId);

    expect(typeof nftLP == "bigint").toBeTruthy();
  }, 20000);

  //   it("gets price correctly", async () => {
  //     const poolAddress = "0xb2FD99528Ce8f7a6AecFC24c286e63E9D19f06F1";

  //     // We're only testing if the function executes without error
  //     await expect(sdk.getPrice(poolAddress)).resolves.toBeDefined();
  //   });
});
