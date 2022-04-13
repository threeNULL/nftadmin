import React, { useState, useEffect } from 'react';

// Libraries
import PropTypes from 'prop-types';
// import stats from 'analytics/matomo';

function CopyButton(props) {
  const { text } = props;

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied === false) return undefined;

    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 700);

    return () => {
      clearTimeout(timeout);
    };
  }, [isCopied]);

  const copyText = () => {
    if (!text) return;

    const { navigator } = window;

    if (!navigator || !navigator.clipboard) {
      return;
    }

    navigator.clipboard.writeText(text);

    setIsCopied(true);

    // stats.push(['trackEvent', 'Profile Display', 'Code copied']);
  };

  return (
    <button
      className="cleanButton has-background-black has-width-50 has-height-30 has-fullheight br6 is-inline-block pb-1"
      type="button"
      onClick={copyText}
    >

      {
           isCopied
             ? <i className="has-text-white fas fa-check is-size-6" />
             : <p className="has-text-white has-text-weight-bold">Copy</p>
      }
    </button>
  );
}

CopyButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CopyButton;
