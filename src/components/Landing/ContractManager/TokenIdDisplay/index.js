import React, { useMemo } from 'react';

// Libraries
import PropTypes from 'prop-types';

function TokenIdDisplay(props) {
  const { tokenId } = props;

  const tokenIdDisplay = useMemo(() => {
    if (tokenId.length < 6) {
      return tokenId;
    }

    return `${tokenId.substring(0, 4)}...${tokenId.substring(tokenId.length - 3)}`;
  }, [tokenId]);

  return (
    <div className="is-flex has-space-between">
      <p className="has-text-weight-bold">
        Token ID:
      </p>
      {
            tokenIdDisplay
              ? (
                <p className="shorten-text has-max-width-150">
                  {tokenIdDisplay}
                </p>
              )
              : (
                <p className="has-text-grey">
                  No token id found
                </p>
              )
          }
    </div>
  );
}

TokenIdDisplay.propTypes = {
  tokenId: PropTypes.string.isRequired,
};

export default TokenIdDisplay;
