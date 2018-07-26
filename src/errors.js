/**
 * Creates an error with the given message
 * @param {String} msg is the error message
 * @return {Error} Error with the given message
 */
function createError(msg) {
  let err = new Error(msg);
  Error.captureStackTrace(err, createError);
  return err;
}

module.exports = {
  InvalidParameter: createError('Invalid Parameter'),
  ParametersMissing: createError('Some required parameters are not provided'),
  InvalidFilePath: createError('Invalid file path '),
};

