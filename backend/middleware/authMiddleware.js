import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler (async (req, res, next) => {
    let token

    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
            try {
                token = req.headers.authorization.split(' ')[1]

                const decoded = jwt.verify(token, process.env.JWT_SECRET)
          
                req.user = await User.findById(decoded.id).select('-password')
                console.log(typeof req.user._id)
                next()
            } catch (error) {
                console.error(error)
                res.status(401)
                throw new Error('Not Authorized, Token Failed')
            }
    }

    if(!token) {
        res.status(401)
        throw new Error('Not Authorized, No Token')
    }
})

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin')
    }
}

export {protect, admin}