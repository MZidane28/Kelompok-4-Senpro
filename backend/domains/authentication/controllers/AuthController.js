const asyncHandler = require('express-async-handler')
const bcrypt = require("bcrypt");
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const cookieConfig = require('../../../configs/cookieConfig')

const AuthQuery = require("../query/AuthQuery")

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


    // cek user

    // insert token forget password (Jika sudah ada, suruh cek email lagi)

    // send email

    return res.status(200).json({message : "Sukses, sudah terkirim ke email"})
})

/**
 * POST /auth/forget-password/change
 * register dengan email, nomor telp, username, password, dan nama
*/
const forgetPasswordChange = asyncHandler( async(req,res,next) => {

    // cek token forget password

    // insert password baru dan delete password lama


    return res.status(200).json({message : "Sukses, sudah berhasil mengubah password"})
})

/**
 * PUT /auth/logout
 * logout dengan hapus cookies
*/
const logoutUser = asyncHandler( async(req,res,next) => {
    // Hapus session

    // Hapus cookies

    return res.status(200).json({message : "User berhasil logout"})
})

module.exports = {
    ensureUser,
    loginUser,
    logoutUser,
    registerUser,
    forgetPasswordChange,
    forgetPasswordSend
}