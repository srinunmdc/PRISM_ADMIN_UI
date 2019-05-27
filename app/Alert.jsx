import React from "react";
import PropTypes from "prop-types";

const Alert = ({ alertClass, highlightedMessage, detailMessage }) => (
  <div className={`media alert alert-${alertClass}`}>
    <div className="media-left" />
    <div className="media-body">
      <strong>{highlightedMessage}</strong> {detailMessage}
    </div>
  </div>
);

Alert.propTypes = {
  alertClass: PropTypes.oneOf([
    "success",
    "info",
    "danger",
    "warning",
    "message"
  ]),
  highlightedMessage: PropTypes.string.isRequired,
  detailMessage: PropTypes.string
};

Alert.defaultProps = {
  alertClass: "message",
  detailMessage: ""
};
export default Alert;
