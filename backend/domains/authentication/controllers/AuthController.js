const asyncHandler = require('express-async-handler')
const bcrypt = require("bcrypt");
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const cookieConfig = require('../../../configs/cookieConfig')
const moment = require('moment-timezone');

const AuthQuery = require("../query/AuthQuery")
const ForgetPasswordQuery = require("../query/ForgetPasswordQuery");
const { send_mail } = require('../../../utils/azure-nodemailer-service');

const timezone = process.env.MOMENT_TIMEZONE;

/**
 * GET /auth/ensure-user
 * memastikan cookie session user authorized
*/
const ensureUser = asyncHandler( async(req,res,next) => {
    //console.log("USER : ", req.user)
    return res.status(200).json({message : "User terautorisasi"})
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
        const credential = jwt.verify(req.cookies[process.env.COOKIE_NAME], process.env.JWT_SECRET || "secret");
        if(credential) {
            token_cookies = credential.token
        }
    }

    // cek username atau email
    const checkUserResponse = await AuthQuery.checkUserAlreadyExist(username_or_email, username_or_email);
    if(checkUserResponse.sql_error_message) {
        throw new Error(checkUserResponse.sql_error_message);
    } else if (checkUserResponse.SQLResponse?.rowCount == 0) {
        return res.status(401).json({message : "Email atau username tidak ditemukan"})
    } 
    const userData = checkUserResponse.SQLResponse.rows[0];

    // cek password
    const isPasswordCorrect = await bcrypt.compare(password, checkUserResponse.SQLResponse?.rows[0].password);
    if(!isPasswordCorrect) {
        return res.status(401).json({message : "Password salah"})
    }

    // cek juga sudah terverifikasi
    if(userData.already_verified == false) {
        return res.status(401).json({message : "Akun belum terverifikasi melewati email", is_verified : false})
    }


    // insert session
    const userTokenQuery = await AuthQuery.insertOrUpdateNewSession(userData.id, token_cookies, rememberMe);
    if(userTokenQuery?.sql_error_message) {
        throw new Error(userTokenQuery?.sql_error_message);
    }
    if(userTokenQuery?.SQLResponse.rowCount <= 0) {
        return res.status(500).json({message : "Tolong login beberapa saat lagi"})
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

    return res.status(200).json({message : "Login berhasil"})
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
        return res.status(401).json({message : "Email atau username sudah teregistrasi"})
    }

    // hash pwd
    const hashPWD = await bcrypt.hash(password, 10);

    // insert user
    const insertUserResponse = await AuthQuery.insertNewUser(username, email, hashPWD);

    // send email


    return res.status(200).json({message : "User berhasil teregistrasi"})
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
        return res.status(404).json({message: "Email tidak ditemukan"})
    }

    const userData = searchEmailQuery.SQLResponse.rows[0]

    // insert token forget password (Jika sudah ada, suruh cek email lagi)
    const updateForgetTokenQuery = await ForgetPasswordQuery.insertNewToken(userData.email);
    //console.log(updateForgetTokenQuery);
    if(updateForgetTokenQuery.is_error || updateForgetTokenQuery.is_sql_error) {
        throw Error(updateForgetTokenQuery.sql_error_message || updateForgetTokenQuery.other_error_message);
    }

    // send email

    return res.status(200).json({message : "Sukses, sudah terkirim ke email"})
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
        return res.status(404).json({message: "Token tidak valid"})
    }

    const user_data = searchUserPasswordToken.SQLResponse.rows[0]
    const time_expire = moment.tz(user_data.forget_password_expire, timezone)
    const now = moment.tz(timezone);

    if(now.isAfter(time_expire)) {
        return res.status(401).json({message : "Token sudah expire"})
    }
    if(email != user_data.email) {
        return res.status(401).json({message : "Token tidak valid untuk email ini"})
    }

    // insert password baru dan delete password lama
    const hashPWD = await bcrypt.hash(new_password, 10);
    const updatePasswordQuery = await ForgetPasswordQuery.insertNewPassword(hashPWD, user_data.id)
    if(updatePasswordQuery.is_sql_error || updatePasswordQuery.is_error) {
        throw Error(updatePasswordQuery.sql_error_message || updatePasswordQuery.other_error_message);
    }


    return res.status(200).json({message : "Sukses, sudah berhasil mengubah password"})
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
            return res.status(500).json({message : "Telah terjadikan kesalahan saat hapus session, mohon logout lagi"})
        }
    }
    //console.log(deleteSessionQuery)

    // Hapus cookies
    res.clearCookie(process.env.COOKIE_NAME, {...cookieConfig, maxAge: 0});

    return res.status(200).json({message : "User berhasil logout"})
})

/**
 * PATCH /auth/activate
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
        return res.status(404).json({message : "Token verifikasi tidak valid"})
    }


    return res.status(200).json({message : "User teverifikasi"})
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
        return res.status(404).json({message : "User tidak ditemukan", is_error : true})
    }
    const user_data_query = getUserInfoQuery.SQLResponse.rows[0]

    return res.status(200).json({message : "User tervalidasi", user: {...user_data_query}})
})

/**
 * GET /auth/send-mail
 * informasi user
*/
const sendMail = asyncHandler( async(req,res,next) => {
    const send = await send_mail(`<html>
				<body>
					<h1>Hello world via email.</h1>
				</body>
			</html>`, 'wafiafdi@gmail.com', "Something")

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