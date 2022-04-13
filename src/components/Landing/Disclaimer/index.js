import React, { useState } from 'react';

function Disclaimer() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  if (!showDisclaimer) return null;

  return (
    <div
      className="is-absolute top-0 z-index-max has-background-black has-fullwidth is-flex px-3 py-2"
    >
      <p
        className="has-text-white has-text-weight-bold"
      >
        ⚠ Always make sure the URL is nftadmin.xyz! Bookmark it to be safe!
      </p>
      <div className="has-margin-left-auto">
        <button
          type="button"
          className="cleanButton has-text-white"
          onClick={() => setShowDisclaimer(false)}
        >
          <i className="fas fa-times" />
        </button>
      </div>
    </div>
  );
}

export default Disclaimer;
