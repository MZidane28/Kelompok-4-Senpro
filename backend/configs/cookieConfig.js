const cookieConfig = {
    maxAge : 15 * 24 * 60 * 60 * 1000,
    httpOnly : true,
    secure : true,
    sameSite : 'lax',
    domain : process.env.DOMAIN_COOKIE,
}

module.exports = cookieConfig