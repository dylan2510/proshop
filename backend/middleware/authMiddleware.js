import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';
import User from "../models/userModel.js";

// Middleare to ensure token in request header
export const protect = asyncHandler(async (req,res,next) => {

    let token;

    if (req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")) {
        
        try {
            // get token from header
            token = req.headers.authorization.split(" ")[1];

            // decode token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // get user without password
            // put user in req object so it can be assessible from here
            req.user = await User.findById(decoded.id).select("-password");

            next();
        }
        catch (error) {
            console.error(error);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
    
});

export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    }
    else 
    {
        res.status(401);
        throw new Error("Not authorized as an admin");
    }
}