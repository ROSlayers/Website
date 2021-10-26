require('babel-register');
require('babel-polyfill');

const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

const MATIC_API_KEY = process.env.MATIC_APP_KEY;
const MNEMONIC = process.env.MNEMONICS;
const INFURA_KEY = process.env.INFURA_KEY;
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const PROJECT_ID = process.env.PROJECT_ID
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

const build_hook = "curl -X POST -d {} https://api.netlify.com/build_hooks/615f3954b8fcb45a130bd572";

module.exports = {
  
  plugins: [
    'truffle-plugin-verify'
  ],

  api_keys: {
    bscscan: process.env.BSC_API_KEY
  },

  networks: {
   
     development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },

    rinkeby: {
      networkCheckTimeout: 100000,
      provider: () => new HDWalletProvider(MNEMONIC, RINKEBY_RPC_URL),
      network_id: 4,
      // from: '0xb11045516b284223ba8f3e59417b872112d46502',
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      websockets: true
    },

    mumbai: {
      networkCheckTimeout: 100000,
      provider: () =>  new HDWalletProvider(MNEMONIC, `https://rpc-mumbai.maticvigil.com/v1/36979eb100867132fd73f238f67bc09336b392c2`),
      network_id: 80001,
      confirmations: 2,
      skipDryRun: true
      // websockets: true
    },
    matic: {
      networkCheckTimeout: 100000,
      provider: () => new HDWalletProvider(MNEMONIC, `zhttps://rpc-mainnet.maticvigil.com/v1/${MATIC_API_KEY}`),
      network_id: 137,
      // from: '0xb11045516b284223ba8f3e59417b872112d46502',
      websockets: true,
      confirmations: 2,
      // timeoutBlocks: 200,
      skipDryRun: true
    }, 
    ropsten: {
      networkCheckTimeout: 1000000,
      provider: () => new HDWalletProvider(MNEMONIC, `https://ropsten.infura.io/v3/9eaec967d5f44a959b94297b81b5e728`),
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    polygon_mumbai: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://polygon-mumbai.infura.io/v3/9eaec967d5f44a959b94297b81b5e728`),
      network_id: 80001,
      confirmations: 2,
      networkCheckTimeout: 100000,
      skipDryRun: true

    },

    bsc_testnet: {
      
      networkCheckTimeout: 800000,
      provider: () => new HDWalletProvider(MNEMONIC, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      // from: '0x77295879a1Cae13c3a1b7740588D742BeC5a736d',
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
      // websockets: true
      
    },
    bsc: {
      networkCheckTimeout: 10000,
      provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
      
      
    },
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websocket: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/YOUR-PROJECT-ID`),
    // network_id: 3,       // Ropsten's id
    // gas: 5500000,        // Ropsten has a lower block limit than mainnet
    // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       },
       evmVersion: "byzantium"  
      }
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows: 
  // $ truffle migrate --reset --compile-all
  //
  // db: {
    // enabled: false,
    // host: "127.0.0.1",
    // adapter: {
    //   name: "sqlite",
    //   settings: {
    //     directory: ".db"
    //   }
    // }
  // }
};
