import React from "react";
import Web3 from 'web3';
// import SlayerBadge from '../abis/SlayerBadge.json';

const SlayerBadge = require('../abis/SlayerBadge.json');
const abi = SlayerBadge.abi;
const accountAddress = "0xeF743429a07C9ac3e5aBaeEF30EFd58fA55F9fe2"; //"0xE717861a0EDc09b4cF35A60B8AB114d4C49dC2Bd";

export const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.eth_requestAccounts;
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
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
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
  const accountAddress = accounts[0];
  console.log(` ${this} Contract address is ${accountAddress}` );
  const networkId = await web3.eth.net.getId();
  const networkData = SlayerBadge.networks[networkId];
  if(networkData) {
    const abi = SlayerBadge.abi;
    // const contractAdddress = networkData.address;
    const contract = new web3.eth.Contract(abi, accountAddress);
    console.log(`Contract loaded successfully`);
    return {
      address: accountAddress,
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
  const accounts = await web3.eth.getAccounts();
  const accountAddress = accounts[0];

  return new web3.eth.Contract(abi, accountAddress);
}

export const transferFunds = async (amount, recepient) => {
  const contract = await loadContract();

  let obj = {};
  // contract.
  const amountInWei = window.web3.utils.toWei(amount, "ether");
  window.web3.eth.sendTransaction({
    from: window.ethereum.selectedAddress,
    to: recepient,
    value: window.web3.utils.toWei(`${amount}`, 'ether'),
    // data: contract.methods.transferFunds(recepient).encodeABI()
  })
  .then(function(receipt) {
    console.log(receipt);
    return {
      success: true,
      status: "✅ Successfully minted."
    };
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

  // console.log(`Contract address is ${contract}`);
  // const web3 = await window.web3;
  // const contract = await new web3.eth.Contract(abi, accountAddress);
  let response = {};
  // try {
  // (async () => { 
    /*
  await window.web3.eth.sendTransaction({
    from: window.ethereum.selectedAddress,
    // to: contractAddress,
    value: window.web3.utils.toWei("", "ether")
  })
  .then((receipt) => {
    console.log("sucessful");
  })
  .catch((error) => {
    console.log("Error ", error.message);
  });*/
  // const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

  let contractAdr = contract.adddress;
  console.log("Contract address is: ", contractAdr);


  const tx = {
    'from': window.ethereum.selectedAddress,
    'to': '0xE717861a0EDc09b4cF35A60B8AB114d4C49dC2Bd',
    // 'nonce': nonce,
    'gasPrice': '20000000000',
    'value': window.web3.utils.toWei('.05', 'ether'),
    'data': contract.methods.mint("uri").encodeABI()
  };

  // using the callback
  await window.web3.eth.sendTransaction({
    from: window.ethereum.selectedAddress,
    to: '0xE717861a0EDc09b4cF35A60B8AB114d4C49dC2Bd',
    value: window.web3.utils.toWei('0.05', 'ether'),
    data: contract.methods.mint("uri").encodeABI()
  })
  .then(function(receipt) {
    console.log(receipt);
    return {
      success: true,
      status: "✅ Successfully minted."
    };
  })
  .then(function(error) {
    console.log(`Something went wrong. Details: ${error.message} `);
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }); 
  
  /*
  const signPromise = web3.eth.accounts.signTransaction(tx, "PRIVATE_KEY");
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              `The hash of your transaction: ${hash} 
              \nCheck bscscan to view status of your transaction.`
            );
          }else {
            console.log(`Something went wrong when submitting your 
            transaction ${err.message}`);
          }
        }
      );
    })
    .catch((err) => {
      error.log(`Promise failed ${err}`);
    }); */
  // }
/*
  contract.methods.mint("tokenURI").send({
    from: window.ethereum.selectedAddress, 
    // gasPrice: "20000000000", 
    value:  window.web3.utils.toWei("0.01", "ether")
  })
  .on('receipt', (receipt) => {
    obj = {
      success: true,
      status: "✅ Successfully minted.",
    };
    console.log(`Status = ${obj.status}`);
    return obj;
  })
  .on('error', (error) => {
    obj = {
      success: false,
      status: "😥 Something went wrong: " + error.message
    };
    console.log(`Status = ${obj.status}`);
    return obj;
    
  });

  // } catch (error) {
  //   obj = {
  //     success: false,
  //     status: "😥 Something went wrong: " + error.message
  //   };
  //   console.log(`Error Status = ${obj.status}`);
  // }

  return obj; 
  */
};