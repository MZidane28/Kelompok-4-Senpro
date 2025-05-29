const asyncHandler = require('express-async-handler')
const bcrypt = require("bcrypt");
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const cookieConfig = require('../../../configs/cookieConfig')
const moment = require('moment-timezone');

const AuthQuery = require("../query/AuthQuery")
const ForgetPasswordQuery = require("../query/ForgetPasswordQuery");
const { send_activation_email, send_password_reset } = require('../../../utils/nodemailer-service');

const timezone = process.env.MOMENT_TIMEZONE;

/**
 * GET /auth/ensure-user
 * memastikan cookie session user authorized
*/
const ensureUser = asyncHandler( async(req,res,next) => {
    //console.log("USER : ", req.user)
    return res.status(200).json({message : "User authorized"})
})

/**
 * POST /auth/login
 * login dengan email dan password
*/
const loginUser = asyncHandler( async(req,res,next) => {
    const { username_or_email, password, rememberMe } = req.body;

    // cek cookies jika ada 
    let token_cookies = null;
    if(req.cookies[process.env.COOKIE_NAME]) {
        let credentials = null;
        try {
            credentials = jwt.verify(req.cookies[process.env.COOKIE_NAME], process.env.JWT_SECRET || "secret");
        } catch (error) {
            //console.log(error)
        }
        if(credentials) {
            token_cookies = credentials.token
        }
    }

    // cek username atau email
    const checkUserResponse = await AuthQuery.checkUserAlreadyExist(username_or_email, username_or_email);
    if(checkUserResponse.sql_error_message) {
        throw new Error(checkUserResponse.sql_error_message);
    } else if (checkUserResponse.SQLResponse?.rowCount == 0) {
        return res.status(401).json({message : "Email or username not found"})
    } 
    const userData = checkUserResponse.SQLResponse.rows[0];

    // cek password
    const isPasswordCorrect = await bcrypt.compare(password, checkUserResponse.SQLResponse?.rows[0].password);
    if(!isPasswordCorrect) {
        return res.status(401).json({message : "Password is incorrect"})
    }

    // cek juga sudah terverifikasi
    if(userData.already_verified == false) {
        return res.status(401).json({message : "Account not yet verified", is_verified : false})
    }


    // insert session
    const userTokenQuery = await AuthQuery.insertOrUpdateNewSession(userData.id, token_cookies, rememberMe);
    if(userTokenQuery?.sql_error_message) {
        throw new Error(userTokenQuery?.sql_error_message);
    }
    if(userTokenQuery?.SQLResponse.rowCount <= 0) {
        return res.status(500).json({message : "Try login later"})
    }
    const token_response = userTokenQuery?.SQLResponse.rows[0].token

    // jwt
    const jwtMessage = {
        username : userData.username,
        id : userData.id,
        waktu_login : Date.now(),
        token : token_response
    }
    const sessionToken = jwt.sign(
        jwtMessage, 
        process.env.JWT_SECRET, {
        expiresIn: rememberMe ? "7d" : process.env.JWT_EXPIRES_IN
    });

    // return cookies
    res.cookie(
        process.env.COOKIE_NAME,
        sessionToken,
        cookieConfig
    )

    return res.status(200).json({message : "Login successful"})
})

/**
 * POST /auth/register
 * register dengan email, nomor telp, username, password, dan nama
*/
const registerUser = asyncHandler( async(req,res,next) => {
    const { email, username, password } = req.body;

    // cek user sudah ada atau belum
    const checkUserResponse = await AuthQuery.checkUserAlreadyExist(username, email);
    if(checkUserResponse.sql_error_message) {
        throw new Error(checkUserResponse.sql_error_message);
    } else if (checkUserResponse.SQLResponse?.rowCount) {
        return res.status(401).json({message : "Email or username has been registered"})
    }

    // hash pwd
    const hashPWD = await bcrypt.hash(password, 10);

    // insert user
    const insertUserResponse = await AuthQuery.insertNewUser(username, email, hashPWD);

    // new user data
    const newUserData = insertUserResponse.SQLResponse.rows[0]

    // send email
    const sendActivationEmail = send_activation_email(newUserData.email, newUserData.activation_token)


    return res.status(200).json({message : "User successfully registered, check your email"})
})

/**
 * POST /auth/forget-password
 * kirim email untuk forget password
*/
const forgetPasswordSend = asyncHandler( async(req,res,next) => {
    const { email } = req.body

    // cek user email
    const searchEmailQuery = await ForgetPasswordQuery.findUserEmail(email);
    if(searchEmailQuery.is_sql_error || searchEmailQuery.is_error) {
        throw Error(searchEmailQuery.sql_error_message || searchEmailQuery.other_error_message);
    }
    if(searchEmailQuery.SQLResponse.rowCount <= 0 ) {
        return res.status(404).json({message: "Email not found"})
    }
    const email_user = searchEmailQuery.SQLResponse.rows[0].email

    // insert token forget password (Jika sudah ada, suruh cek email lagi)
    const updateForgetTokenQuery = await ForgetPasswordQuery.insertNewToken(email_user);
    //console.log(updateForgetTokenQuery);
    if(updateForgetTokenQuery.is_error || updateForgetTokenQuery.is_sql_error) {
        throw Error(updateForgetTokenQuery.sql_error_message || updateForgetTokenQuery.other_error_message);
    }

    const userData = updateForgetTokenQuery.SQLResponse.rows[0]

    // send email
    const sendPasswordResetEmail = send_password_reset(userData.email, userData.forget_password_token)

    return res.status(200).json({message : "Password reset has been sent to email"})
})

/**
 * POST /auth/forget-password/change
 * register dengan email, nomor telp, username, password, dan nama
*/
const forgetPasswordChange = asyncHandler( async(req,res,next) => {
    const { new_password, email, token } = req.body

    // cek token forget password dan cek expiration
    const searchUserPasswordToken = await ForgetPasswordQuery.findPasswordToken(token);
    if(searchUserPasswordToken.is_sql_error || searchUserPasswordToken.is_error) {
        throw Error(searchUserPasswordToken.sql_error_message || searchUserPasswordToken.other_error_message);
    }
    if(searchUserPasswordToken.SQLResponse.rowCount <= 0 ) {
        return res.status(404).json({message: "Token is not valid"})
    }

    const user_data = searchUserPasswordToken.SQLResponse.rows[0]
    const time_expire = moment.tz(user_data.forget_password_expire, timezone)
    const now = moment.tz(timezone);

    if(now.isAfter(time_expire)) {
        return res.status(401).json({message : "Token has expire"})
    }
    if(email != user_data.email) {
        return res.status(401).json({message : "Token is not valid for this email"})
    }

    // insert password baru dan delete password lama
    const hashPWD = await bcrypt.hash(new_password, 10);
    const updatePasswordQuery = await ForgetPasswordQuery.insertNewPassword(hashPWD, user_data.id)
    if(updatePasswordQuery.is_sql_error || updatePasswordQuery.is_error) {
        throw Error(updatePasswordQuery.sql_error_message || updatePasswordQuery.other_error_message);
    }


    return res.status(200).json({message : "Password has been changed successfully"})
})

/**
 * PUT /auth/logout
 * logout dengan hapus cookies
*/
const logoutUser = asyncHandler( async(req,res,next) => {
    // cek jika ada cookies
    const cookieJWT = req.cookies[process.env.COOKIE_NAME];
    let valid_cookie = false;
    let credential = null;
    if(cookieJWT) {
        credential = jwt.verify(req.cookies[process.env.COOKIE_NAME], process.env.JWT_SECRET || "secret");
        if(credential) {
            valid_cookie = true;
        }
    }

    // Hapus session
    let deleteSessionQuery
    if(valid_cookie) {
        deleteSessionQuery = await AuthQuery.deleteSession(credential.id, credential.token)
        if(deleteSessionQuery.is_sql_error || deleteSessionQuery.is_error) {
            console.log(deleteSessionQuery.error)
            return res.status(500).json({message : "Please logout again, a problem has occured"})
        }
    }
    //console.log(deleteSessionQuery)

    // Hapus cookies
    res.clearCookie(process.env.COOKIE_NAME, {...cookieConfig, maxAge: 0});

    return res.status(200).json({message : "User successfully logout"})
})

/**
 * GET /auth/activate
 * aktifkan akun
*/
const activateAccount = asyncHandler( async(req,res,next) => {
    const { token } = req.params

    // update verification
    const updateVerificationQuery = await AuthQuery.updateVerifiedUser(token)

    if(updateVerificationQuery.is_sql_error || updateVerificationQuery.is_error) {
        throw Error(updateVerificationQuery.sql_error_message || updateVerificationQuery.other_error_message);
    }

    if(updateVerificationQuery.rowCount == 0) {
        return res.status(404).json({message : "Verification token not valid"})
    }

    return res.redirect(process.env.FE_URL + "/email-verified")
})

/**
 * GET /auth/user-info
 * informasi user
*/
const getUserInformation = asyncHandler( async(req,res,next) => {
    const data_user = req.user

    // update verification
    const getUserInfoQuery = await AuthQuery.getUserInfo(data_user.id)

    if(getUserInfoQuery.is_sql_error || getUserInfoQuery.is_error) {
        throw Error(getUserInfoQuery.sql_error_message || getUserInfoQuery.other_error_message);
    }

    if(getUserInfoQuery.rowCount == 0) {
        return res.status(404).json({message : "User not found", is_error : true})
    }
    const user_data_query = getUserInfoQuery.SQLResponse.rows[0]

    return res.status(200).json({message : "User is valid", user: {...user_data_query}})
})

/**
 * GET /auth/send-mail
 * test send email
*/
const sendMail = asyncHandler( async(req,res,next) => {

    return res.status(200).json({message : "JALAN"})
})

module.exports = {
    ensureUser,
    loginUser,
    logoutUser,
    registerUser,
    forgetPasswordChange,
    forgetPasswordSend,
    activateAccount,
    getUserInformation,
    sendMail
}