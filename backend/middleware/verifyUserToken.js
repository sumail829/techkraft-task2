import jwt from "jsonwebtoken";
import 'dotenv/config'


const verifyUserToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(404).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_USERTOKEN);
    
    // Check if the user is an admin
    // if (decoded.role !== "admin") {
    //   return res.status(403).json({ message: "Forbidden. Not an admin." });
    // }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyUserToken;
