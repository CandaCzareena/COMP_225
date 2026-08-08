function handleError(req, res) {
  // Your code to handle the error
}

// Takes a Mongoose error and turns it into a readable string message
function getErrorMessage(err) {
  let message = "";

  // Case 1: duplicate key error (example: email already used)
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err);
        break;
      default:
        message = "Something went wrong";
    }
  } else {
    // Case 2: schema validation error (required field, minlength, etc.)
    for (let errName in err.errors) {
      if (err.errors[errName].message) {
        message = err.errors[errName].message;
      }
    }
  }

  // IMPORTANT: must return the message, otherwise the caller gets undefined
  return message;
}

// Helper function to read the duplicated field name from Mongo's error text
function getUniqueErrorMessage(err) {
  let output;
  try {
    let fieldName = err.message.substring(
      err.message.lastIndexOf(".$") + 2,
      err.message.lastIndexOf("_1")
    );
    output =
      fieldName.charAt(0).toUpperCase() +
      fieldName.slice(1) +
      " already exists";
  } catch (ex) {
    output = "Unique field already exists";
  }
  return output;
}

export default {
  handleError: handleError,
  getErrorMessage: getErrorMessage,
};