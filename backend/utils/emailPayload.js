require("dotenv").config();

const URLBaseFE = process.env.FE_URL
const URLBaseBE = process.env.BE_URL

const emailActivation = (token) => {
    return `
    <div>
        <h1>Selamat anda telah mendaftarkan akun di Empati</h1>
        <p>
        Press this link to activate account <span><a href="${URLBaseBE}/auth/activate/${token}" target="_blank" >link</a></span>
        </p>
    </div>
    `
}

const passwordReset = (token, email) => {
    return `
    <div>
        <h1>Forgot Your Password?</h1>
        <p>
            Press this link to reset your password <span><a href="${URLBaseFE}/change-password?token=${token}&email=${email}" target="_blank" >link</a></span>
        </p>
        <p>
            If you didn't ask to reset your password, ignore this email
        </p>
    </div>
    `
}
module.exports = {passwordReset, emailActivation}