require("dotenv").config();
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const authQuery = require("../query/AuthQuery")
const cookieConfig = require('../../../configs/cookieConfig')
const AuthQuery = require("../query/AuthQuery")


/**
 * MiddleWare
 * memastikan cookie session user authorized
*/
const MiddlewareEnsureUser = asyncHandler( async(req,res,next) => {
    const cookieJWT = req.cookies[process.env.COOKIE_NAME];
    if(!cookieJWT) {
        return res.status(401).json({message : "session tidak ditemukan"})
    }

    const credential = jwt.verify(req.cookies[process.env.COOKIE_NAME], process.env.JWT_SECRET || "secret");
    if(!credential) {
        return res.status(401).json({message : "session tidak valid"})
    }

    // cek validitas token
    const searchTokenQuery = await AuthQuery.checkTokenSession(credential.id, credential.token);
    if(searchTokenQuery.sql_error_message) {
        throw new Error(searchTokenQuery.sql_error_message)
    }
    if(searchTokenQuery.SQLResponse.rowCount <= 0 ) {
        return res.status(401).json({message : "session tidak terotorisasi"})
    }
    const dataUser = searchTokenQuery.SQLResponse.rows[0];

    req.user = {
        id: dataUser.id,
        token: dataUser.token,
        email: dataUser.email,
        username: dataUser.username,
        verified: dataUser.already_verified,
        profile_filled: dataUser.profile_filled
    }

    next();
})

module.exports = {
    MiddlewareEnsureUser
}