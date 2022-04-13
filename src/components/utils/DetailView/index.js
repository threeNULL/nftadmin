import React, { useState } from 'react';

// Libraries
import PropTypes from 'prop-types';

function DetailView(props) {
  const { text } = props;

  const [isOpen, setIsOpen] = useState(false);
  return (

    <div>

      <button
        type="button"
        className="cleanButton"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`has-text-info fas ${isOpen ? 'fa-caret-down' : 'fa-caret-right'}`} />
        <p
          className="mx-1 is-inline has-text-info"
        >
          Details
        </p>
      </button>

      {
        isOpen
        && (
        <div className="mx-4 is-size-7">
          <p>
            { text }
          </p>
        </div>
        )
    }
    </div>
  );
}

DetailView.propTypes = {
  text: PropTypes.string.isRequired,
};

export default DetailView;
