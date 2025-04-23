const db = require("../../../configs/dbConfig")
const moment = require("moment-timezone")

/**
 * @param {string} username_or_email nilai username atau email yang diinput
 * @brief delete artikel dengan id slug
 */
const findUserAuth = async(username_or_email) => {
    const client = await db.connect();
    try {
        await client.query("BEGIN")
        const searchUser = `
            SELECT id, password, username, email, forget_password_token, forget_password_expire FROM public.user WHERE username = $1 OR email = $1;
        `
        const resultSession = await client.query(searchUser, [username_or_email]);
        client.release()
        return {
            is_error : false,
            SQLResponse : resultSession,
            other_error_message : null,
            is_sql_error : null
        }
    } catch (error) {
        client.release()
        return {
            is_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    }
}

/**
 * @param {string} username_or_email nilai username atau email yang diinput
 * @brief delete artikel dengan id slug
 */
const checkUserAlreadyExist = async(username, email) => {
    const client = await db.connect();
    try {
        const searchUser = `
            SELECT id, password, username, email, already_verified, profile_filled FROM public.user WHERE username = $1 OR email = $2;
        `
        const resultSession = await client.query(searchUser, [username, email]);
        client.release()
        return {
            is_error : false,
            SQLResponse : resultSession,
            error_message : null,
            error : null,
        }
    } catch (error) {
        client.release()
        return {
            is_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message,
            error : error,
        }
    }
}

/**
 * @brief cari token di tabel user_session
 */
const checkTokenSession = async(id, token) => {
    const client = await db.connect();
    try {
        const searchUserToken = `
            SELECT public.user.id, public.user.username, public.user.email, public.user.already_verified, public.user.profile_filled, user_session.token 
            FROM public.user_session 
            JOIN public.user ON public.user.id = user_session.id_user
            WHERE id_user = $1 AND token = $2
            ;
        `
        const resultSession = await client.query(searchUserToken, [id, token]);
        return {
            is_error : false,
            SQLResponse : resultSession,
            error_message : null,
            error : null,
        }
    } catch (error) {
        
        return {
            is_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message,
            error : error,
        }
    } finally {
        client.release()
    }
}

/**
 * @param {string} id_user 
 * @param {string} token 
 * @brief insert token authentication
 */
const updateOrInsertSession = async(id_user, token) => {

    const client = await db.connect();
    try {
        await client.query("BEGIN")
        const search_session = `
            SELECT id_user FROM user_session WHERE id_user = $1;
        `
        const insert_token = `
           INSERT INTO user_session (id_user, token) VALUES ($1, $2) RETURNING *
        `
        const update_token = `
            UPDATE user_session SET token = $1, id_user = $2, updated_at = NOW() WHERE id = $2 RETURNING *;
        `
        const searchUserResult = await client.query(search_session, [id_user]);
        let resultSession;
        if(searchUserResult.rowCount != 0) {
            // update session
            resultSession = await client.query(update_token, [id_user, token]);
        } else {
            // new session
            resultSession = await client.query(insert_token, [id_user, token]);
        }
        await client.query("COMMIT")
        client.release()
        return {
            is_error : false,
            SQLResponse : resultSession,
            error_message : null
        }
    } catch (error) {
        await client.query("ROLLBACK")
        client.release()
        return {
            is_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    }
}

/**
 * @param {string} id_user 
 * @param {string} cookie_token 
 * @param {boolean} is_remember_me
 * @brief insert token authentication
 */
const insertOrUpdateNewSession = async(id_user, cookie_token, is_remember_me) => {
    const client = await db.connect();
    try {
        await client.query("BEGIN")
        const insert_token = `
           INSERT INTO user_session (id_user, expires_at) VALUES ($1, ${is_remember_me ? `CURRENT_TIMESTAMP + INTERVAL '7 days'` : `CURRENT_TIMESTAMP + INTERVAL '24 hours'`}) RETURNING *
        `
        const check_token = `
            SELECT id_user, token FROM user_session WHERE id_user = $1 AND token = $2;
        `
        let resultSession;
        if(cookie_token) {

            // check session
            const checkSession = await client.query(check_token, [id_user, cookie_token]);
            if(checkSession.rowCount == 0) {
                // insert new token
                
                resultSession = await client.query(insert_token, [id_user]);
            } else {
                // token yang sudah ada 
                return {
                    is_error : false,
                    SQLResponse : checkSession,
                    error_message : null
                }
            }
        } else {
            // new session
            resultSession = await client.query(insert_token, [id_user]);
        }
        await client.query("COMMIT")
        return {
            is_error : false,
            SQLResponse : resultSession,
            error_message : null
        }
    } catch (error) {
        await client.query("ROLLBACK")
        return {
            is_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    } finally {
        client.release()
    }
}


/**
 * @param {string} id_user 
 * @brief delete token authentication
 */
const deleteSession = async(id_user) => {

    const client = await db.connect();
    try {
        await client.query("BEGIN")
        const delete_token = `
            DELETE FROM user_session WHERE id_user = $1;
        `
        const resultSession = await client.query(delete_token, [id_user]);
        await client.query("COMMIT")
        client.release()
        return {
            is_error : false,
            SQLResponse : resultSession,
            error_message : null
        }
    } catch (error) {
        await client.query("ROLLBACK")
        client.release()
        return {
            is_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    }
}


/**
 * @param {string} username 
 * @param {string} email 
 * @brief insert user
 */
const insertNewUser = async(username, email, hashed_password) => {
    const client = await db.connect();
    try {
        await client.query("BEGIN")
        const insert_user = `
           INSERT INTO public.user (username, email, password) VALUES ($1, $2, $3) RETURNING *;
        `
        let resultSession = await client.query(insert_user, [username, email, hashed_password]);
        await client.query("COMMIT")
        client.release()
        return {
            is_error : false,
            SQLResponse : resultSession,
            error_message : null
        }
    } catch (error) {
        await client.query("ROLLBACK")
        client.release()
        return {
            is_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    }
}



/**
 * @param {string} hashed_password 
 * @param {string} token_forget_password 
 * @brief ubah password
 */
const insertNewPassword = async(hashed_password, token_forget_password) => {
    const client = await db.connect();
    try {
        const check_token =`
            SELECT forget_password_token, forget_password_expire FROM public.user WHERE forget_password_token = $1;
        `
        let check_token_session = await client.query(check_token, [token_forget_password]);
        if(check_token_session.rowCount == 0) {
            return {
                is_error : true,
                SQLResponse : null,
                other_error_message : "Token password tidak valid",
                sql_error_message : null
            }
        } else {
            // cek jika lebih besar dari hari ini
            const forgetPasswordExpire = moment(check_token_session.rows[0].forget_password_expire);
            const now = moment().tz("UTC"); // Current time in UTC

            if (forgetPasswordExpire.isBefore(now)) {
                return {
                    is_error: true,
                    SQLResponse: null,
                    other_error_message: "Token password telah kedaluwarsa",
                    sql_error_message: null
                };
            }
        }

        const update_password = `
           UPDATE public.user SET password = $1, forget_password_token = NULL, forget_password_expire = NULL WHERE id = $2 RETURNING *;
        `
        let resultSession = await client.query(update_password, [hashed_password, id_user]);
        return {
            is_error : false,
            SQLResponse : resultSession,
            error_message : null
        }
    } catch (error) {
        return {
            is_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    } finally {
        client.release()
    }
}

/**
 * @param {string} forget_password_token 
 * @param {string} id_user 
 * @brief ubah password
 */
const updateForgetPasswordToken = async(forget_password_token, id_user) => {
    const client = await db.connect();
    try {
        const futureTime = moment().tz("UTC").add(24, 'hours').format("YYYY-MM-DD HH:mm:ss");
        const update_password = `
           UPDATE public.user SET forget_password_token = $1, forget_password_expire = $3 WHERE id = $2 RETURNING *;
        `
        let resultSession = await client.query(update_password, [forget_password_token, id_user, futureTime]);
        client.release()
        return {
            is_error : false,
            SQLResponse : resultSession,
            error_message : null
        }
    } catch (error) {
        client.release()
        return {
            is_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    }
}

module.exports = {
    checkUserAlreadyExist,
    findUserAuth,
    updateOrInsertSession,
    insertNewUser,
    insertNewPassword,
    updateForgetPasswordToken,
    deleteSession,
    insertOrUpdateNewSession,
    checkTokenSession
}