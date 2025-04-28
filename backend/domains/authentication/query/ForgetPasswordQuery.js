const db = require("../../../configs/dbConfig")
const moment = require("moment-timezone")

/**
 * @param {string} email 
 * @brief cari user berdasarkan email
 */
const findUserEmail = async(email) => {
    const client = await db.connect();
    try {
        await client.query("BEGIN")
        const searchUser = `
            SELECT id, username, email, forget_password_token, forget_password_expire FROM public.user WHERE email = $1;
        `
        const resultSession = await client.query(searchUser, [email]);
        return {
            is_error : false,
            SQLResponse : resultSession,
            other_error_message : null,
            is_sql_error : null
        }
    } catch (error) {
        return {
            is_error : true,
            is_sql_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    } finally {
        client.release();
    }
}

const insertNewToken = async(email) => {
    const client = await db.connect();
    try {
        await client.query("BEGIN")
        const insertPasswordToken = `
                UPDATE public.user 
                SET forget_password_expire = (CURRENT_TIMESTAMP + '1 day'::interval), forget_password_token = gen_random_uuid()
                WHERE email = $1;
        `
        const resultSession = await client.query(insertPasswordToken, [email]);
        await client.query("COMMIT")
        return {
            is_error : false,
            SQLResponse : resultSession,
            other_error_message : null,
            is_sql_error : null
        }
    } catch (error) {
        return {
            is_error : true,
            is_sql_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    } finally {
        client.release();
    }
}


const findPasswordToken = async(token) => {
    const client = await db.connect();
    try {
        const searchUser = `
            SELECT id, username, email, forget_password_token, forget_password_expire FROM public.user WHERE forget_password_token = $1;
        `
        const resultSession = await client.query(searchUser, [token]);
        return {
            is_error : false,
            SQLResponse : resultSession,
            other_error_message : null,
            is_sql_error : null
        }
    } catch (error) {
        return {
            is_error : true,
            is_sql_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    } finally {
        client.release();
    }
}

const insertNewPassword = async(new_password, id) => {
    const client = await db.connect();
    try {
        await client.query("BEGIN")
        const insertPasswordToken = `
                UPDATE public.user 
                SET password = $1, forget_password_expire = NULL, forget_password_token = NULL
                WHERE id = $2;
        `
        const resultSession = await client.query(insertPasswordToken, [new_password, id]);
        await client.query("COMMIT")
        return {
            is_error : false,
            SQLResponse : resultSession,
            other_error_message : null,
            is_sql_error : null
        }
    } catch (error) {
        return {
            is_error : true,
            is_sql_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    } finally {
        client.release();
    }
}



module.exports = {
    findUserEmail,
    insertNewToken,
    findPasswordToken,
    insertNewPassword
}