# leNFT SDK  

The leNFT SDK is a javascript package that wraps logic around the leNFT protocol. It allows developers to use leNFT as a backend for liquidity for their NFT projects.

To install: 

    npm i lenft-sdk

Example usage:

    import leNFT from "lenft-sdk";	
    let provider;

    if (window.ethereum == null) {
	    console.log("MetaMask not installed; using read-only defaults");
	    provider = ethers.getDefaultProvider();
	} else {
	    console.log("MetaMask installed; using MetaMask provider");
	    provider = new ethers.BrowserProvider(window.ethereum);
    }
    
	const lenft = new leNFT(provider);
	const poolAddress = "0x...";
	const buyQuote = await lenft.getBuyQuote(amount, poolAddress);
	await lenft.buy(poolAddress, buyQuote.exampleNFTs, buyQuote.price);

An overview of the functionality is outlined in the [docs](https://docs.lenft.fi/sdk/).