const asyncHandler = require('express-async-handler')
const bcrypt = require("bcrypt");
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const cookieConfig = require('../../../configs/cookieConfig')

/**
 * GET /auth/ensure-user
 * memastikan cookie session user authorized
*/
const ensureUser = asyncHandler( async(req,res,next) => {

    return res.status(200).json({message : "User terautorisasi"})
})

/**
 * POST /auth/login
 * login dengan email dan password
*/
const loginUser = asyncHandler( async(req,res,next) => {
    // cek username atau email

    // insert session

    // jwt

    // return

    return res.status(200).json({message : "Login berhasil"})
})

/**
 * POST /auth/register
 * register dengan email, nomor telp, username, password, dan nama
*/
const registerUser = asyncHandler( async(req,res,next) => {


    // cek user sudah ada atau belum

    // hash pwd

    // insert user

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