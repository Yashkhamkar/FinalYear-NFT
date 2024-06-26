import React, { useEffect, useState, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { Router, json, useNavigate } from "react-router-dom/dist";
import { nftaddress, ABI } from "./constants";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { type } from "@testing-library/user-event/dist/type";
import Swal from "sweetalert2";
const fetchContract = (signerOrProvider) => {
  return new ethers.Contract(nftaddress, ABI, signerOrProvider);
};

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export const NFTMarketplaceContext = React.createContext();
export const NFTMarketplaceProvider = ({ children }) => {
  const navigate = useNavigate();

  const [CurrentAccount, setCurrentAccount] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const title = "Where Art Meets Blockchain: Discover";
  const connectingWithSmartContract = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      return { signer, contract };
    } catch (error) {
      console.log("Error connecting with smart contract:", error);
    }
  };
  const disconnectWallet = async () => {
    try {
      setCurrentAccount(null);
      setIsConnected(false);
      navigate("/");
    } catch (error) {
      console.log("Error disconnecting wallet:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Get Metamask!");
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        console.log("Make sure you have metamask!");
      }
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        console.log("Found an authorized account: ", accounts[0]);
        setCurrentAccount(accounts[0]);
        setIsConnected(true);
      } else {
        console.log("No account found");
        setIsConnected(false);
      }
    } catch (error) {
      console.log(error);
      setIsConnected(false);
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    try {
      const { contract } = await connectingWithSmartContract();
      console.log("Contract:", contract);
      const price = ethers.utils.parseUnits(formInputPrice, "ether");
      console.log("Price:", price);
      console.log("URL:", url);
      console.log("isReselling:", isReselling);
      console.log("id:", id);
      const listingPrice = await contract.getListingPrice();
      console.log("Listing Price:", listingPrice.toString());
      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.resellToken(id, price, {
            value: listingPrice.toString(),
          });
      const receipt = await transaction.wait();
      console.log("Transaction Receipt:", receipt);
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Your NFT has been listed!",
      });
      navigate("/market");
    } catch (error) {
      console.log("Error creating sale:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      throw error;
    }
  };
  const fetchNFTs = async () => {
    try {
      // const { contract } = await connectingWithSmartContract();
      // const provider = new ethers.providers.JsonRpcProvider();
      const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-amoy.g.alchemy.com/v2/IEhW7Tz0ZWO70Y_Fa-JVxdk_KUWPXfi7"
      );
      const contract = fetchContract(provider);
      const data = await contract.fetchMarketItems(); // Invoke fetchMarketItems function
      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(unformattedPrice, "ether");
            return {
              price,
              tokenId,
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );
      console.log(items); // Log items to the console
      return items;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyNFTs = async (type) => {
    try {
      const { contract } = await connectingWithSmartContract();
      const data =
        type == "fetchItemsListed"
          ? await contract.fetchItemsListed()
          : await contract.fetchMyNFTs();
      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(unformattedPrice, "ether");
            return {
              price,
              tokenId,
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );
      return items;
    } catch (error) {
      console.log(error);
    }
  };
  const createNft = async (name, description, image, price) => {
    if (!name || !description || !image || !price) return;

    try {
      const existingItems = await fetchNFTs();
      const imageHash = image.replace("https://gateway.pinata.cloud/ipfs/", "");

      // if (existingItems.some((item) => item.image === imageHash)) {
      //   Swal.fire({
      //     icon: "warning",
      //     title: "Duplicate Image",
      //     text: "This NFT already exists. Please choose a different image.",
      //   });
      //   return;
      // }

      const data = JSON.stringify({
        name,
        description,
        image,
      });

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data, // Pass the data directly, not inside an object
        {
          headers: {
            pinata_api_key: "1f82349ea0bcdbd62e5e",
            pinata_secret_api_key:
              "2f7f352a6e0d94ce7dfba395d888b95cf153ec0c45d952a5d41392075e641111",
            "Content-Type": "application/json", // Use "application/json" for JSON data
          },
        }
      );

      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log(url);
      await createSale(url, price);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };
  const buyNft = async (nft) => {
    try {
      const { contract } = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
        gasLimit: 300000,
      });
      console.log("Transaction Hash:", transaction.hash);
      console.log("Transaction Receipt:", await transaction.wait());
      // await transaction.wait();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Your NFT has been purchased!",
      });
      navigate("/nfts");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.log(error.message);
    }
  };
  return (
    <NFTMarketplaceContext.Provider
      value={{
        title,
        connectWallet,
        createNft,
        fetchNFTs,
        fetchMyNFTs,
        checkIfWalletIsConnected,
        buyNft,
        disconnectWallet,
        createSale,
        isConnected,
        CurrentAccount,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
