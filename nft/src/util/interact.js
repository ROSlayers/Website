import React from "react";
import Web3 from 'web3';
import Axios from 'axios';
import axios from "axios";
// import { NFTStorage } from "nft.storage";

require('dotenv').config();
const SlayerBadge = require('../abis/SlayerBadge.json');
const abi = SlayerBadge.abi;
const contractAddress = "0xc8f41c573d129c8327ba8adcd1f8ccb131242be0"; //"0xE717861a0EDc09b4cF35A60B8AB114d4C49dC2Bd";


export const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
  const accounts = await window.ethereum.request({method: 'eth_accounts'});
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  }
  else {
    console.log("Non-ethereum browser detected. Try instaling Metamask.")
  }
}


export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      let options = await getCharacters();
      console.log("Options in interact.js: " + options)
      const obj = {
        status: "👆🏽 Mint a token.",
        address: addressArray[0],
        options: options
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
        options: []
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
      options: []
    };
  }
};


export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const loadBlockchainData = async () => {
  const web3 = window.web3;
  // Load account
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  console.log(` ${this} Contract address is ${account}` );
  const networkId = await web3.eth.net.getId();
  const networkData = SlayerBadge.networks[networkId];
  if(networkData) {
    const abi = SlayerBadge.abi;
    // const contractAdddress = networkData.address;
    const contract = new web3.eth.Contract(abi, contractAddress);
    console.log(`Contract loaded successfully`);
    return {
      address: account,
      status: "👆🏽 Write a message in the text-field above.", 
    };
  } else {
    console.log('Smart contract not deployed to detected network');
    return {
      address: "",
      status: "🦊 Connect to Metamask using the top right button.",
    };
  }
};

const loadContract = async () => {
  const web3 = window.web3;
  // const accounts = await web3.eth.getAccounts();
  // const accountAddress = accounts[0];

  return new web3.eth.Contract(abi, contractAddress);
}

export const deposit = async (amount, payer, char_id) => {
  const contract = await loadContract();
  let formatDate = date => 
    `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  
  let data = {
    name_id: 30008,
    quantity: amount,
    char_id: char_id,
    redeemed: 0,
     //new Date('Y-m-d H:i:s'), //2001-03-10 15:35:03
  };
  
  let obj = {};
  // contract.
  const amountInWei = window.web3.utils.toWei(amount, "ether");
  window.web3.eth.sendTransaction({
    from: payer,
    to: window.ethereum.selectedAddress,
    value: window.web3.utils.toWei(`${amount}`, 'ether'),
    // data: contract.methods.transferFunds(recepient).encodeABI()
  })
  .then(function(receipt) {
    console.log(receipt);
    Axios.post("http://localhost:3001/api/insert", {
      data: data
    }).then(response => {
      console.log(response.data);
      return {
        success: true,
        status: "✅ Successfully minted."
      };
    });
  })
  .then(function(error) {
    console.log(`Something went wrong. Details: ${error.message} `);
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }); 
};  


export const mint = async () => {
  
  const contract = await loadContract();
  const mintFee = await contract.methods.getMintFee().call();
  console.log('Mint fee is', mintFee);
  console.log(`Contract address: ${contract.options.address}`);
  
  let contractAdr = contract.options.address;
  console.log("Contract address is: ", contractAdr);
  
  return (
  contract.methods.mint("uri").send({
    from: window.ethereum.selectedAddress, 
    gasPrice: "20000000000", 
    value: mintFee
  })
    .on('transactionHash', async (hash) => {
      console.log(hash);
      return  {
        success: true,
        status: "✅ Successfully minted.",
      };
    })
    .on('error', async (error) => {
      console.log(error);
      return {
        success: false,
        status: "😥 Something went wrong: " + error.message
      };
      // return obj;
      
    }));
  // } catch (error) {
  //   obj = {
  //     success: false,
  //     status: "😥 Something went wrong: " + error.message
  //   };
  //   console.log(`Error Status = ${obj.status}`);
  // }

  // return obj; 
  
};

/*
const storeMetadata = async () => {
  const client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });
  const metadata = await client.store({
    name: 'name',
    description: 'description',
    image: new File([await fs.promises.readFile('pinpie.jpg')], 'pinpie.jpg', {
      type: 'image/jpg'
    })
  });

  const metadataURI = metadata.url.href.replace(/^ipfs:\/\//, "");

};
*/

const instance = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 8000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  }
});


const getCharacters = async  () => {
  var options;
  const walletAdr = '0xAcD12ae8F8d0312e567C7Be02CB3D42734460939'; //window.ethereum.selectedAddress;
  return (
  instance.get(`/get_char/${walletAdr}`)
  .then(response => {
    console.log("---Response: ", response.data);
    var res = response.data;
    options = res[0].success ? res[1].data : [];
    console.log('Options ' , options);
    return options;
  })
  .catch(error => {
    console.log(`Error occured in $: ${error}`);
  })
  // console.log("Options out: " + options);
  );
};