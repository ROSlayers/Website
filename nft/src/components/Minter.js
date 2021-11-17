import React from "react";
import { useEffect, useState } from "react";
// import { NFTStorage, File } from "nft.storage";
import {
  connectWallet,
  getCurrentWalletConnected,
  mint,
	loadWeb3,
	deposit,
	// getCharacters
} from "../util/interact.js";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
	const [success, setSuccess] = useState("");

  const [amount, setAmount] = useState(0);
	const [payer, setRecepient] = useState("");
	const [options, setOptions] = useState([]);
	const [character, setCharacter] = useState(0);
//   const [description, setDescription] = useState("");
//   const [url, setURL] = useState("");

  useEffect(() => {
		async function x() {
			await loadWeb3();
		// await
			const { address, status, options } = await connectWallet(); // getCurrentWalletConnected();

			setWallet(address);
			setStatus(status);
			setOptions(options || []);
			console.log("Options: " + options);

			addWalletListener();
		}
		
		x();
	}, []);

	const getWallet = async () => {
		await getCurrentWalletConnected()
	}

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
		// const option = await getCharacters();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
		// setOptions([...options, option]);
		// console.log('options: ' + options + "-- option: " + option)
  };

  const onMintPressed = async () => {
    let { success, status } = await mint();
		console.log("Response is ", success, ". Status ", status);
    setStatus(status);
		console.log("sucess: ", success, "status: ", status);
		setSuccess(success);
    if (success) {
			console.log("sucess");
    //   setName("");
    //   setDescription("");
    //   setURL("");
    }
  };

	const onDeposit = async () => {
		const response = await deposit(amount, payer, character);
		console.log(`In tra = ${response}`);
		/*.then((response) => {
			const { success, status } =response;
			setSuccess(success);
			setStatus(status);
		})
		.catch((error) => {
			const [success, status] = error;
			setSuccess(success);
			setStatus(status);
		});*/
	};


	const switchSection =  (elem) => {
		let depositSec = document.querySelector("#deposit-sec");
		let mintSec = document.querySelector("#mint-sec");
		
		if(elem.id === "mint") {
			mintSec.className = "section block"; 
			depositSec.className = "section d-none"; 
		} else {
			mintSec.className = "section d-none"; 
			depositSec.className = "section block"; 
		}

		// if(walletAddress) {
		// 	let response = await getCharacters();
		// 	console.log("Options: ", options, "Results: " + response);
		// }	
	};

	
/*
	const metadata = () => {

	};
*/
  return (
		<div>
			<div className="navbar nabar-light" style={{backgroundColor: "#e3f2fd"}}>
				<a
					className="navbar-brand col-sm-3 col-md-2 mr-0"
					href="/"
					target="#"
					rel="noopener noreferrer"
				>
					SlayerBadge Tokens
				</a>
			</div>
				<div className="container-fluid Minter">
					<div className="row ">
						<div className="col-6 mt-5 mx-auto shadow p-3">
							<div className="mt-3 text-right">
								<div className="row">
									<div className="form-group">
										
									</div>
								</div>
								<div className="row">
									<button 
										className="btn btn-primary" 
										id="walletButton" 
										onClick={connectWalletPressed}
									>
										{walletAddress.length > 0 ? (
										"Connected: " +
										String(walletAddress).substring(0, 6) +
										"..." +
										String(walletAddress).substring(38)
										) : (
											<span>Connect Wallet</span>
										)}
									</button>
								</div>
							</div>
							<div className="row goto-sec my-3">
								<div className="nav">
									<a href="#" id="mint"
										onClick={(event) => switchSection(event.target)}
									>Goto Mint Page</a>
								</div>
								<div className="nav position-absolute" style={{right:0}}>
									<a href="#" id="deposit"
										onClick={(event) => switchSection(event.target)}
									>Goto Deposit Page</a>
								</div>
							</div>
							<div className="row mb-3">
								<div className="mx-auto">
								<br />
								<h1 id="title">SlayerBadge Token</h1>
							
								<div className="section" id="mint-sec">
									<button 
										id="mintButton" 
										className="btn btn-primary"
										onClick={onMintPressed}
									>
										Mint NFT
									</button>
									
								</div>
								<div className="section d-none" id="deposit-sec">
									<form
										className="form-group"
										onSubmit={(event) => {
											event.preventDefault();
											onDeposit();
										}}
									>
										<div className="form-group">
											<div 
												className="input-group mb-3"
											>
												{/* <label 
												 htmlFor="payerInput"
												>
												 Enter Payer Address
												</label> */}
												<input
													name="payer"
													id="payerInput"
													className="form-control"
													type="text"
													placeholder="Paste payer address"
													onChange={(event) => setRecepient(event.target.value)}
												/>
											</div>
											<div className="input-group mb-3">
												<select 
													className="custom-select"
													onChange={evt => setCharacter(evt.target.value)}
												>
													<option defaultValue={""}>Select Character Name</option>
													{ 
														options.map(element => {
															return (<option value={element.char_id}>{ element.char_name }</option>)
														})
													}
													
												</select>
												
											</div>
											<div className="input-group mb-3">
												{/* <label 
													htmlFor="depositInput"
												>
													Deposit
												</label> */}
												<input
													name="deposit"
													id="depositInput"
													className="form-control"
													type="number"
													step="0.01"
													placeholder="Enter amount in BNB"
													onChange={(event) => setAmount(event.target.value)}
												/>
												</div>
												<div 
													className="input-group"
												>
													<input 
														type="submit"
														className="btn btn-primary w-100"
														value="Deposit"
													/>
												{/* </div> */}
											</div>
										</div>
									</form>
								</div>
								<p id="status" style={{ color: "red" }}>
									{status}
								</p>
							</div>
						</div>
					</div>
					<div className="row" id="deposit">
								
					</div>			
				</div>
			</div>
		</div>
	);
};

export default Minter;
