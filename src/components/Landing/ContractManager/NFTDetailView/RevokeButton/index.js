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
import InfoPopup from 'components/utils/InfoPopup';

function RevokeButton(props) {
  const { nft } = props;
  const { tokenAddress } = nft;

  const {
    setApprovalForAll, account, waitForTransaction, isApprovedForAll,
  } = useContext(Web3Context);

  const [address, setAddress] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState('');

  const _revokeAll = async () => {
    try {
      if (!address || !isAddress(address)) {
        setStatus('Please enter a valid address!');
        return;
      }

      if (address.toLowerCase() === account.toLowerCase()) {
        setStatus('Thats your own address! Choose a different one!');
        return;
      }

      setStatus('');
      setDisabled(true);

      const isApproved = await isApprovedForAll(account, address, tokenAddress);

      if (!isApproved) {
        setStatus('This address does not need to be revoked, as it has not been approved before!');
        setDisabled(false);
        return;
      }

      const tx = await setApprovalForAll(address, false);
      setStatus('Waiting for your transaction to be mined now...');
      setTransactionHash(tx);

      await waitForTransaction(tx);
      setStatus('Done! The approval has been revoked. You can close this window now.');

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

  const _setAddress = (val) => {
    setStatus('');
    setAddress(val);
  };

  return (
    <div className="is-flex has-content-centered">
      <Popup
        trigger={(
          <div className="has-fullwidth">
            <button
              type="button"
              className="button br6 has-fullwidth has-text-white has-text-weight-bold has-background-black"
            >
              <i className="fas fa-hand mr-2" />
              Revoke approval
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
                  className={`has-text-weight-bold is-size-4-desktop mb-2 ${disabled ? 'is-loading' : ''}`}
                >
                  Revoke token approval
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

            <p
              className="mt-4"
            >
              Which address should be revoked for this collection?
            </p>
            <input
              type="text"
              className="input br6"
              value={address}
              placeholder="Address"
              onChange={(e) => _setAddress(e.target.value)}
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
              onClick={_revokeAll}
              disabled={disabled || !disclaimerChecked}
            >
              Revoke approval
            </button>

            <div className="has-text-centered">
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
        text="Removes the previously given permission for a wallet / contract to transfer any NFTs that you own (from this collection)"
      />
    </div>

  );
}

RevokeButton.propTypes = {
  nft: PropTypes.shape({
    tokenAddress: PropTypes.string,
    tokenId: PropTypes.string,
  }).isRequired,
};

export default RevokeButton;
