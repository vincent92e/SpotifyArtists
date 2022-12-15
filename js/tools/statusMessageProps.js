// Status message types.
const statusTypes = {
  none: "none",
  success: "status",
  warning: "warning",
  error: "error",
};
// Status message titles.
const statusTitle = {
  success: "Status message",
  warning: "Warning message",
  error: "Error message",
};

// Status message text.
const statusMessageText = {
  duplicate: "Data already exists",
  success: "Artist content type was created successfully!",
  maxCountReached:
    "You have reached the maximum number of artist you can fetch.",
  noData: "Data unavailable, please try again",
};

export { statusTypes, statusTitle, statusMessageText };
