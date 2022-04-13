import React, { useContext, useMemo } from 'react';

// Context
import Web3Context from 'context/Web3Context';

function ChainDisplay() {
  const { chain } = useContext(Web3Context);

  const chainName = useMemo(() => {
    if (chain === 'eth') return 'Ethereum';

    return chain.substring(0, 1).toUpperCase() + chain.substring(1);
  }, [chain]);

  const color = useMemo(() => {
    switch (chain) {
      case 'eth': return '#29b6af';
      case 'rinkeby': return '#f6c343';
      case 'polygon': return '#9064ff';
      case 'ropsten': return '#ff4a8d';
      default: return '#000000';
    }
  }, [chain]);

  return (
    <div className="is-flex">
      <p
        className="mr-1"
      >
        Selected chain:
      </p>
      <p
        ref={(el) => el && el.style.setProperty('color', color, 'important')}
        className="has-text-weight-bold"

      >
        {chainName}
      </p>
    </div>
  );
}

export default ChainDisplay;
