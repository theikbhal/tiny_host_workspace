const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'Missing x-api-key header'
    });
  }

  // For mock purposes, we accept any key that is not empty.
  // In a real app, you would validate against a database.
  console.log(`Authenticated with key: ${apiKey}`);
  next();
};

module.exports = authMiddleware;
