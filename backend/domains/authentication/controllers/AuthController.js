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
    return res.status(200).json({message : "Login berhasil"})
})

/**
 * POST /auth/register
 * register dengan email, nomor telp, username, password, dan nama
*/
const registerUser = asyncHandler( async(req,res,next) => {
    return res.status(200).json({message : "User berhasil teregistrasi"})
})

/**
 * PUT /auth/logout
 * logout dengan hapus cookies
*/
const logoutUser = asyncHandler( async(req,res,next) => {
    return res.status(200).json({message : "User berhasil logout"})
})

module.exports = {
    ensureUser,
    loginUser,
    logoutUser,
    registerUser
}