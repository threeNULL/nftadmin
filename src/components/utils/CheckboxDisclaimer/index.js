import React from 'react';

// Libraries
import PropTypes from 'prop-types';

function Disclaimer(props) {
  const { checked, setChecked, disabled } = props;

  return (
    <div className="">
      <label className="checkbox dont-select-text">
        <input
          checked={checked}
          disabled={disabled}
          onChange={() => setChecked(!checked)}
          type="checkbox"
          className="mr-1"
        />
        <p
          className="is-inline"
        >
          I have read the
        </p>

        <a
          href={`${window.location.origin}#faq`}
          className="mx-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          FAQ
        </a>

        <p
          className="is-inline"
        >
          and I know what I&apos;m doing
        </p>

      </label>
    </div>
  );
}

Disclaimer.propTypes = {
  disabled: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  setChecked: PropTypes.func.isRequired,
};

export default Disclaimer;
