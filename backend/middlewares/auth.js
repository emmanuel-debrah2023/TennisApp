const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    //If there is no token provided with the request 
    if(!token) {
      return res.status(403).send("Access Denied")
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    //Double check which secret key used 
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
    
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};

module.exports = verifyToken;