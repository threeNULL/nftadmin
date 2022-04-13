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

function ApproveButton(props) {
  const { nft } = props;
  const { tokenAddress, tokenId } = nft;

  const {
    approve, account, waitForTransaction, getApproved,
  } = useContext(Web3Context);

  const [address, setAddress] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState('');

  const _approve = async () => {
    try {
      if (!address || !isAddress(address)) {
        setStatus('Please enter a valid address!');
        return;
      }

      if (address.toLowerCase() === account.toLowerCase()) {
        setStatus('This is your own address, choose a different one!');
        return;
      }

      setStatus('');
      setDisabled(true);

      const approver = await getApproved(tokenId, tokenAddress);

      if (approver.toLowerCase() === address.toLowerCase()) {
        setStatus('This address has already been approved!');
        setDisabled(false);
        return;
      }

      const tx = await approve(address, tokenId, tokenAddress);
      setStatus('Waiting for your transaction to be mined...');
      setTransactionHash(tx);

      await waitForTransaction(tx);
      setStatus('Done! The approval has been given. You can close this window now.');

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
              disabled={disabled}
              className="button br6 has-fullheight has-fullwidth has-text-white has-text-weight-bold has-background-black"
            >
              <i className="fas fa-check-circle mr-2" />
              <p
                className="has-text-white has-max-fullwidth white-space-normal"
              >
                Approve an address for one transfer
              </p>

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
                  Approve an address for one transfer
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
              className="mt-4 mb-3"
            >
              Enter the address that gets the permission to transfer this NFT once:
            </p>
            <input
              type="text"
              className="input br6"
              value={address}
              placeholder="Enter address"
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
              className={`button grow has-text-white has-background-black has-fullwidth br6 has-text-weight-bold ${disabled ? 'is-loading' : ''}`}
              type="button"
              onClick={_approve}
              disabled={disabled || !disclaimerChecked}
            >
              Approve
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
        text="The provided address (wallet or smart contract) will get the permission to transfer this NFT to another account once. The approval is cleared when the NFT is transferred."
      />
    </div>

  );
}

ApproveButton.propTypes = {
  nft: PropTypes.shape({
    tokenAddress: PropTypes.string,
    tokenId: PropTypes.string,
  }).isRequired,
};

export default ApproveButton;
