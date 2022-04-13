import React, { useContext, useState } from 'react';

// Context
import Web3Context from 'context/Web3Context';

// Libraries
import PropTypes from 'prop-types';
import { isAddress } from 'ethers/lib/utils';

// Components
import Popup from 'reactjs-popup';
import CheckboxDisclaimer from 'components/utils/CheckboxDisclaimer';
import NFTDisplay from '../../NFTDisplay';
import EtherscanLink from '../../EtherscanLink';
import ContractLink from '../../ContractLink';
import TokenIdDisplay from '../../TokenIdDisplay';
import InfoPopup from 'components/utils/InfoPopup';

function TransferButton(props) {
  const { nft } = props;
  console.log(nft);
  const {
    tokenAddress, tokenId, tokenSymbol, tokenName,
  } = nft;

  const { safeTransferFrom, account, waitForTransaction } = useContext(Web3Context);

  const [sendAddress, setSendAddress] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState('');

  const _transfer = async () => {
    try {
      if (!sendAddress) return;

      if (!isAddress(sendAddress)) {
        setStatus('Please enter a valid address!');
        return;
      }

      if (sendAddress.toLowerCase() === account.toLowerCase()) {
        setStatus('This is your own address, choose a different one!');
        return;
      }

      setStatus('');
      setDisabled(true);

      const tx = await safeTransferFrom(account, sendAddress, tokenId, tokenAddress);
      setStatus('Waiting for your transaction to be mined...');
      setTransactionHash(tx);

      await waitForTransaction(tx);
      setStatus('Done! Your NFT has been transfered.');

      setDisabled(false);
    } catch (e) {
      console.log(e);

      if (e.code === 4001) {
        setStatus('You cancelled the transaction.');
      } else {
        setStatus('Oops! Seems like there was an error.');
      }

      setDisabled(false);
    }
  };

  const _setSendAddress = (val) => {
    setStatus('');
    setSendAddress(val);
  };

  return (
    <div className="is-flex has-content-centered">
      <Popup
        trigger={(
          <div className="has-fullwidth">
            <button
              type="button"
              className="button br6 has-fullwidth has-text-weight-bold has-background-black has-text-white"
            >
              <i className="fas fa-arrow-right-arrow-left mr-2" />
              Transfer
            </button>

          </div>

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
          <div className="box p-5 has-max-width-450">
            <div className="columns">
              <div className="column p-0">
                <p
                  className="has-text-weight-bold is-size-4-desktop mb-2"
                >
                  Transfer your NFT
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

            <div className="is-flex has-content-centered my-3">
              <NFTDisplay nft={nft} />
            </div>

            <ContractLink address={tokenAddress} />
            <TokenIdDisplay tokenId={tokenId} />

            <p
              className="mt-4 is-size-6 mb-3"
            >
              Enter the address you want to send the NFT to:
            </p>
            <input
              type="text"
              className="input br6"
              value={sendAddress}
              placeholder="Enter address"
              onChange={(e) => _setSendAddress(e.target.value)}
            />

            <div className="my-5">
              <CheckboxDisclaimer
                disabled={disabled}
                checked={disclaimerChecked}
                setChecked={setDisclaimerChecked}
              />
            </div>

            <button
              className={`button grow has-background-black has-text-white has-fullwidth br6 has-text-weight-bold ${disabled ? 'is-loading' : ''}`}
              type="button"
              onClick={_transfer}
              disabled={disabled || !disclaimerChecked}
            >
              Transfer
            </button>
            <div
              className="has-text-centered"
            >
              <p
                className="has-text-weight-bold mt-2 break-word"
              >
                {status}
              </p>
            </div>
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
      <InfoPopup
        text="Transfers the NFT to a different address."
      />
    </div>

  );
}

TransferButton.propTypes = {
  nft: PropTypes.shape({
    tokenAddress: PropTypes.string,
    tokenId: PropTypes.string,
  }).isRequired,
};

export default TransferButton;
