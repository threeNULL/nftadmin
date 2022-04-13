import React, { useContext, useEffect, useState } from 'react';

// Context
import Web3Context from 'context/Web3Context';

// Libraries
import { ethers } from 'ethers';
import PropTypes from 'prop-types';

const { AddressZero } = ethers.constants;

function ApprovedView(props) {
  const { nft } = props;
  const { tokenAddress, tokenId } = nft;

  const [approvedAddress, setApprovedAddress] = useState('');

  const { getApproved } = useContext(Web3Context);

  useEffect(() => {
    // TODO: check if any address is approved to transfer this token
    const loadApprovalStatus = async () => {
      try {
        const address = await getApproved(tokenId, tokenAddress);

        if (address === AddressZero) return;

        setApprovedAddress(address);
      } catch (e) {
        console.log(e);
      }
    };

    loadApprovalStatus();
  }, [nft]);

  if (!approvedAddress) return null;

  return (
    <div className="">
      <p
        className="has-text-weight-bold"
      >
        {`Address ${approvedAddress} is allowed to transfer this NFT!`}
      </p>
    </div>
  );
}

ApprovedView.propTypes = {
  nft: PropTypes.shape({
    tokenAddress: PropTypes.string,
    tokenId: PropTypes.string,
  }).isRequired,
};

export default ApprovedView;
