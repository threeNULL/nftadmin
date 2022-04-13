import React, { useState, useContext } from 'react';

// Context
import Web3Context from 'context/Web3Context';

// Components
import Popup from 'reactjs-popup';
import EtherscanLink from 'components/Landing/ContractManager/EtherscanLink';

// Donation Wallet
const DONATION_WALLET = '0x591291d14b5692F58AC21E2eD346844E44796624';

function DonationDisplay() {
  const {
    isAuthenticated, sendTransaction, waitForTransaction, chain,
  } = useContext(Web3Context);

  const [amount, setAmount] = useState(0.01);

  const [transactionHash, setTransactionHash] = useState('');

  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState('');

  const tipEth = async () => {
    try {
      setStatus('');
      setDisabled(true);

      if (chain !== 'eth') {
        setStatus('Please change the network to Ethereum Mainnet to tip something!');
        setDisabled(false);
        return;
      }

      if (amount <= 0) {
        setStatus('You need to tip at least SOMETHING :P');
        setDisabled(false);
        return;
      }

      const tx = await sendTransaction(DONATION_WALLET, amount);
      setStatus('Waiting for your transaction to be mined...');
      setTransactionHash(tx);

      await waitForTransaction(tx);
      setStatus('Done! Thank you so much for your tip! <3');

      setDisabled(false);
    } catch (e) {
      console.log(e);
      if (e.error && e.error.code === -32000) {
        setStatus('Seems like you dont have enough ETH :/');
      } else if (e && e.code === 4001) {
        setStatus('You cancelled the transaction. :(');
      } else {
        setStatus('Oops! An error occured. Try again?');
      }
      setDisabled(false);
    }
  };

  const _setAmount = (val) => {
    setStatus('');

    if (val.length > 20) return;

    const regex = /^\d+\.?\d*$/;
    if (!regex.test(val) && val.length !== 0) return;

    setAmount(val);
  };

  if (!isAuthenticated) return null;

  return (
    <Popup
      trigger={(
        <button
          type="button"
          className="button has-hover br5 has-text-white has-background-black has-text-weight-bold"
        >
          Like NFT Admin? Tip some ETH!
        </button>
      )}
      modal
      on={['click']}
      keepTooltipInside="#root"
      repositionOnResize
      closeOnDocumentClick={false}
      lockScroll
    >
      {
         (close) => (
           <div className="box p-5 has-max-width-400">

             <div className="columns">
               <div className="column p-0">
                 <p
                   className="has-text-weight-bold is-size-4-desktop mb-2"
                 >
                   Tip us some ETH!
                 </p>
               </div>
               <div className="column p-0 is-narrow">
                 <div
                   className="has-text-right"
                 >
                   <button
                     type="button"
                     onClick={close}
                     disabled={disabled}
                     className="button br6"
                   >
                     <i className="fas fa-times" />
                   </button>
                 </div>
               </div>
             </div>

             <p
               className="mt-4"
             >
               How much ETH would you like to tip?
             </p>

             <input
               type="text"
               className="input br6"
               value={amount}
               placeholder="Amount in ETH"
               onChange={(e) => _setAmount(e.target.value)}
             />

             <button
               className={`button grow has-text-white has-background-black has-fullwidth br6 has-text-weight-bold mt-4 ${disabled ? 'is-loading' : ''}`}
               type="button"
               onClick={tipEth}
               disabled={disabled}
             >
               Tip ETH
             </button>

             <p
               className="has-text-weight-bold mt-2"
             >
               { status }
             </p>

             {
                 transactionHash
                 && (
                 <div
                   className="has-text-centered"
                 >
                   <EtherscanLink tx={transactionHash} />
                 </div>
                 )
             }
           </div>
         )
     }
    </Popup>
  );
}

export default DonationDisplay;
