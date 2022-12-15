import React from "react";

const StatusMessage = (props) => {
  const { type, title, message } = props.statusMessage;
  return (
    <div
      data-drupal-messages=""
      className="messages-list"
      data-once="claroDetails"
      style={{ display: type !== "none" ? "block" : "none" }}
    >
      <div
        role="contentinfo"
        aria-labelledby="message-status-title"
        className={`messages-list__item messages messages--${type}`}
      >
        <div className="messages__header">
          <h2 id="message-status-title" className="messages__title">
            {title}
          </h2>
        </div>
        <div className="messages__content">{message}</div>
      </div>
    </div>
  );
};

export default StatusMessage;
