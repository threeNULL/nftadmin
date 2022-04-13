import React, { useContext, useMemo } from 'react';

// Context
import Web3Context from 'context/Web3Context';

// Components
import Popup from 'reactjs-popup';

// Libraries
import PropTypes from 'prop-types';
import CopyButton from 'components/utils/CopyButton';

function ContractLink(props) {
  const { address } = props;

  const { chainId } = useContext(Web3Context);

  const contractLink = useMemo(() => {
    switch (chainId) {
      case 1:
        return `https://etherscan.io/address/${address}`;
      case 4:
        return `https://rinkeby.etherscan.io/address/${address}`;
      case 137:
        return `https://polygonscan.com/address/${address}`;
      default: return '';
    }
  }, [chainId, address]);

  const contractDisplay = useMemo(() => {
    if (address.length < 6) {
      return address;
    }

    return `${address.substring(0, 4)}...${address.substring(address.length - 3)}`;
  }, [address]);

  return (
    <div className="is-flex has-space-between">
      <p className="has-text-weight-bold">
        Contract Address:
      </p>
      {
        contractLink
          ? (
            <div>
              <Popup
                trigger={(
                  <a
                    href={contractLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=""
                  >
                    {contractDisplay}
                  </a>
                )}
                on={['hover']}
                position="top center"
                keepTooltipInside="#root"
                repositionOnResize
                closeOnDocumentClick={false}
                arrow={false}
              >
                <div className="box boxshadow br6 has-background-black p-1 has-text-white">
                  <CopyButton text={address} />
                </div>
              </Popup>

            </div>
          )
          : (
            <p className="has-text-grey">
              No contract address found
            </p>
          )
        }
    </div>
  );
}

ContractLink.propTypes = {
  address: PropTypes.string.isRequired,
};

export default ContractLink;
