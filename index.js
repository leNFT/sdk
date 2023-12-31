const ethers = require("ethers");
const axios = require("axios");

// Import the ABIs
const TradingPoolFactoryABI = require("./contracts/TradingPoolFactory.json");
const TradingPoolABI = require("./contracts/TradingPool.json");
const WETHGatewayABI = require("./contracts/WETHGateway.json");
const WETHGatewayAddress = "0x71aC14aa94a28dBA682F5E6185765B32566f3802";

class leNFT {
  constructor(provider, chainId = 1) {
    this.provider = provider;
    this.chainId = chainId;
    this.tradeRouter = "https://trade-router-absrz.ondigitalocean.app";
    this.api = "https://api-h6nqa.ondigitalocean.app";
    this.fetchOptions = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    // Create the contract instances
    this.tradingPoolFactory = new ethers.Contract(
      this.chainId == 1
        ? "0x197456A4f5c3B3605033270Bc04Bc599916CaBA0"
        : "0x3308C60054728B4F19d3FaCeD9D0723Fe96f7872",
      TradingPoolFactoryABI.abi,
      this.provider
    );
  }

  async getPool(nft, token) {
    const pool = await this.tradingPoolFactory.getTradingPool(nft, token);
    return pool;
  }

  async getPoolNFTs(pool) {
    // Call the pool to get the NFT address
    const poolContract = new ethers.Contract(
      pool,
      TradingPoolABI.abi,
      this.provider
    );

    const nftAddress = await poolContract.getNFT();

    console.log("nftAddress", nftAddress);

    // Call the API to get the NFTs held by the pool
    const requestURL =
      this.api +
      "/nfts/address?address=" +
      pool +
      "&chainId=" +
      this.chainId +
      "&collection=" +
      nftAddress;

    const nftsResponse = await axios
      .get(requestURL, this.fetchOptions)
      .catch((err) => console.error(err));

    return nftsResponse.data;
  }

  async getNFTLP(pool, nftId) {
    const poolContract = new ethers.Contract(
      pool,
      TradingPoolABI.abi,
      this.provider
    );

    const nftLP = await poolContract.nftToLp(nftId);

    return nftLP.toString();
  }

  async getPrice(pool) {
    const requestURL =
      this.tradeRouter + "/price?pool=" + pool + "&chainId=" + this.chainId;

    console.log("requestURL", requestURL);

    const priceResponse = await axios
      .get(requestURL, this.fetchOptions)
      .catch((err) => console.error(err));

    return priceResponse.data;
  }

  async getBuyQuote(amount, pool) {
    const requestURL =
      this.tradeRouter +
      "/buy?amount=" +
      amount +
      "&chainId=" +
      this.chainId +
      "&pool=" +
      pool;

    const buyQuoteResponse = await axios
      .get(requestURL, this.fetchOptions)
      .catch((err) => console.error(err));
    const buyQuote = buyQuoteResponse.data;

    return buyQuote;
  }

  async getBuyExactQuote(nfts, pool) {
    const requestURL =
      this.tradeRouter +
      "/buyExact?nfts=" +
      nfts +
      "&pool=" +
      pool +
      "&chainId=" +
      this.chainId;

    const buyExactQuoteResponse = await axios
      .get(requestURL, this.fetchOptions)
      .catch((err) => console.error(err));
    const buyExactQuote = buyExactQuoteResponse.data;

    return buyExactQuote;
  }

  async getSellQuote(amount, pool) {
    const requestURL =
      this.tradeRouter +
      "/sell?amount=" +
      amount +
      "&chainId=" +
      this.chainId +
      "&pool=" +
      pool;

    const sellQuoteResponse = await axios
      .get(requestURL, this.fetchOptions)
      .catch((err) => console.error(err));
    const sellQuote = sellQuoteResponse.data;

    return sellQuote;
  }

  async buy(pool, nftIds, maximumPrice) {
    // Create a new contract instance for the pool
    const wethGatewayContract = new ethers.Contract(
      WETHGatewayAddress,
      WETHGatewayABI.abi,
      await this.provider.getSigner()
    );

    // Execute the buy function
    const buyTx = await wethGatewayContract.buy(pool, nftIds, maximumPrice, {
      value: maximumPrice,
    });

    // Wait for the transaction to be mined
    const receipt = await buyTx.wait();

    // The final price is a return value of the transaction
    // You can extract it from the transaction receipt
    const finalPrice = receipt.events?.find((e) => e.event === "Buy")?.args
      ?.finalPrice;

    return finalPrice;
  }

  async sell(pool, nftIds, liquidityPairs, minimumPrice) {
    // Create a new contract instance for the pool
    const wethGatewayContract = new ethers.Contract(
      WETHGatewayAddress,
      WETHGatewayABI.abi,
      await this.provider.getSigner()
    );

    // Make sure you have enough allowance to spend on behalf of the seller.
    // If not, you will need to first call the approve() function on the token contract.
    // You might also need to adjust the gasLimit and gasPrice values.

    // Execute the sell function
    const sellTx = await wethGatewayContract.sell(
      pool,
      nftIds,
      liquidityPairs,
      minimumPrice
    );

    // Wait for the transaction to be mined
    const receipt = await sellTx.wait();

    // The final price is a return value of the transaction
    // You can extract it from the transaction receipt
    const finalPrice = receipt.events?.find((e) => e.event === "Sell")?.args
      ?.finalPrice;

    return finalPrice;
  }
}

module.exports = leNFT;
