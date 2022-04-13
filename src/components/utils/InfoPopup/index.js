import React from 'react';

// Libraries
import PropTypes from 'prop-types';

// Components
import Popup from 'reactjs-popup';

// Styles
// import styles from './styles.module.scss';

function InfoPopup(props) {
  const { text } = props;

  return (
    <div className="is-inline-block has-info px-1">
      <Popup
        trigger={(
          <button
            className="cleanButton growBig is-relative"
            type="button"
          >
            <i
              className="fas fa-question-circle has-text-black is-size-6"
            />

          </button>
        )}
        position="top center"
        on={['click']}
        keepTooltipInside="#root"
        repositionOnResize
        className=""
      >
        {() => (
          <div className="box has-max-width-200">
            <p className="is-size-7 has-text-weight-semibold">
              {text}
            </p>
          </div>
        )}
      </Popup>
    </div>

  );
}

InfoPopup.propTypes = {
  text: PropTypes.string.isRequired,
};

export default InfoPopup;
