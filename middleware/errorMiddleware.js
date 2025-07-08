module.exports = function errorHandler(err, req, res, next) {
  console.error('🔥 errorHandler called');
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
