import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";


const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (token) {
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded.userId).select("-password");
          next();
      } catch (error) {
          res.status(401).send({ message: 'Token is not valid' });
      }
  } else {
      res.status(401).send({ message: 'No token, authorization denied' });
  }
  });
  
//Admin middleware
const admin = (req,res,next) =>{
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.send(401);
        throw new Error("Not authorized as admin")
    }
}

export {protect,admin}
