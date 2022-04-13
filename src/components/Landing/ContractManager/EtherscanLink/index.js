import React, { useContext, useMemo } from 'react';

// Context
import Web3Context from 'context/Web3Context';

// Libraries
import PropTypes from 'prop-types';

function EtherscanLink(props) {
  const { tx } = props;

  const { chainId } = useContext(Web3Context);

  const link = useMemo(() => {
    switch (chainId) {
      case 1:
        return `https://etherscan.io/tx/${tx}`;
      case 4:
        return `https://rinkeby.etherscan.io/tx/${tx}`;
      case 137:
        return `https://polygonscan.com/tx/${tx}`;
      default: return '';
    }
  }, [chainId, tx]);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="is-info"
    >
      Show transaction
      <i className="fas fa-external-link ml-2" />
    </a>
  );
}

EtherscanLink.propTypes = {
  tx: PropTypes.string.isRequired,
};

export default EtherscanLink;
