async function withDbErrorHandling(operation, fn) {
  try {
    return await fn();
  } catch (err) {
    if (err.statusCode) throw err;
    err.message = `Database error during ${operation}: ${err.message}`;
    throw err;
  }
}

module.exports = withDbErrorHandling;