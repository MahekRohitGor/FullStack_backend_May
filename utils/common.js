const crypto = require("crypto");
const nodemailer = require("nodemailer");

if (!process.env.HASH_KEY || !process.env.HASH_IV) {
    throw new Error("HASH_KEY and HASH_IV environment variables must be defined");
}

const key = Buffer.from(process.env.HASH_KEY, 'hex');
const iv = Buffer.from(process.env.HASH_IV, 'hex');
const database = require("../config/database");
const constants = require("../config/creds");

class Common {
    encrypt(requestData) {
        try {
            if (!requestData) {
                return null;
            }
            const data = typeof requestData === "object" ? JSON.stringify(requestData) : requestData;
            const cipher = crypto.createCipheriv('AES-256-CBC', key, iv);
            let encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            return encrypted;
        } catch (error) {
            console.error("Encryption error:", error);
            return error;
        }
    }

    async sendMail(subject, to_email, htmlContent) {
        try {
            if (!to_email || to_email.trim() === "") {
                throw new Error("Recipient email is empty or undefined!");
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: constants.mailer_email,
                    pass: constants.mailer_password
                }
            });

            const mailOptions = {
                from: constants.from_email,
                to: to_email,
                subject: subject,
                html: htmlContent,
                text: "Please enable HTML to view this email.",
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(info);
            return { success: true, info };
        } catch (error) {
            console.log(error);
            return { success: false, error };
        }
    }

    response(res,message){
        return res.json(message);
    }

    decrypt(requestData) {
        try {
            if (!requestData) {
                return {};
            }
            const decipher = crypto.createDecipheriv('AES-256-CBC', key, iv);
            let decrypted = decipher.update(requestData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return this.isJson(decrypted) ? JSON.parse(decrypted) : decrypted;
        } catch (error) {
            console.log("Error in decrypting: ", error);
            return requestData;
        }
    }

    isJson(str) {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }

    async requestValidation(v) {
        if (v.fails()) {
            const Validator_errors = v.getErrors();
            const error = Object.values(Validator_errors)[0][0];
            return {
                code: true,
                message: error
            };
        } 
        return {
            code: false,
            message: ""
        };
    }

    sendEncryptedResponse(res, statusCode, message, data) {
        const resp_data = {
            code: statusCode,
            message,
            data
        };
        return res.status(statusCode).send(this.encrypt(resp_data));
    }

    generateOtp(length){
        if(length <= 0){
            throw new Error("OTP length must be greater than 0");
        }
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * digits.length)];
        }
        return otp;
    }

    async check_email(email){
        try{
            const [results] = await database.query(`SELECT user_id from tbl_user where email_id = ? and is_active = 1 and is_deleted = 0`, [email]);
            if(results && Array.isArray(results) && results.length > 0 && results[0] !== null && results[0].user_id){
                return false;
            } else {
                return true;
            }
        } catch(error){
            console.log(error.message);
            return false
        }
    }

    async check_user_login(email){
        try{
            const [results] = await database.query(`SELECT user_id from tbl_user where email_id = ? and is_active = 1 and is_deleted = 0 and is_login = 1`, [email]);
            if(results && Array.isArray(results) && results.length > 0 && results[0] !== null && results[0].user_id){
                return true;
            } else {
                return false;
            }
        } catch(error){
            console.log(error.message);
            return false
        }
    }

    async check_admin_login(email){
        try{
            const [results] = await database.query(`SELECT admin_id from tbl_admin where email_id = ? and is_active = 1 and is_deleted = 0 and is_login = 1`, [email]);
            if(results && Array.isArray(results) && results.length > 0 && results[0].admin_id){
                return true;
            } else {
                return false;
            }
        } catch(error){
            console.log(error.message);
            return false
        }
    }

    async get_user_info(user_id){
        try{
            const [res] = await database.query(`SELECT full_name, email_id, profile_pic, about, is_login from tbl_user where user_id = ? and is_active = 1 and is_deleted = 0`, [user_id]);
            console.log("getuserinfo", res)
            return res[0];
        } catch(error){
            console.log(error.message);
            return false;
        }
    }

    async get_event_info(event_id){
        try{
            const [res] = await database.query(`select event_title, event_desc, CAST(event_date AS DATE) as event_date, 
            CAST(event_date AS TIME) as event_time, event_address from tbl_event where event_id = ? and is_active = 1 and is_deleted = 0`, [event_id]);
            if(res && res.length > 0){
                return res[0];
            } else{
                return false
            }
        } catch(error){
            console.log("In catch: ", error);
            return false;
        }
    }

    async get_admin_info(user_id){
        try{
            const [res] = await database.query(`SELECT email_id, admin_id, profile_pic, `, [user_id]);
            return res[0];
        } catch(error){
            console.log(error.message);
            return false;
        }
    }

    async getUser(email_id){
        try{
            const [res] = await database.query(`SELECT user_id, email_id, password_, is_active FROM tbl_user WHERE email_id = ? AND is_active = 1 AND is_deleted = 0`, [email_id]);
            if (res.length > 0) {
                return res[0];
            } else {
                return false;
            }
        } catch(error){
            console.log(error);
            return false;
        }
    }

    async getAdmin(email_id){
        try{
            const [res] = await database.query(`SELECT admin_id, email_id, password_, is_active FROM tbl_admin WHERE email_id = ? AND is_active = 1 AND is_deleted = 0`, [email_id]);
            if (res.length > 0) {
                return res[0];
            } else {
                return false;
            }
        } catch(error){
            console.log(error);
            return false;
        }
    }

    async updateUserData(user_id, data) {
        try {
            const [result] = await database.query(`UPDATE tbl_user SET ? WHERE user_id = ?`, [data, user_id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    }

    async updateAdminData(admin_id, data) {
        try {
            const [result] = await database.query(`UPDATE tbl_admin SET ? WHERE admin_id = ?`, [data, admin_id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    }

    generateRandomCode(length){
        if(length <= 0){
            throw new Error("Number length must be greater than 0");
        }
        const digits = '0123456789QWERTYUIOPASDFGHJKLZXCVBNM';
        let num = '';
        for (let i = 0; i < length; i++) {
            num += digits[Math.floor(Math.random() * digits.length)];
        }
        return num;
    }

    async get_event_price(event_id){
        try{
            const [result] = await database.query(`select event_price from tbl_event where event_id = ?`, [event_id]);
            if(result && result.length > 0){
                return result[0].event_price;
            } else{
                const price = 0;
                return price;
            }
        } catch(error){
            console.log(error.message);
            const price = 0;
            return price;
        }
    }

    async check_event(event_id){
        try{
            const [rows] = await database.query(`select event_id from tbl_event where now() < event_date and event_id = ? and is_active = 1 and is_deleted = 0;`, [event_id]);
            if(rows && rows.length > 0){
                return true;
            } else{
                return false;
            }
        } catch(error){
            console.log(error);
            return false
        }
    }

    async check_avail_tickts(qty, event_id){
        try{
            const [rows] = await database.query(`select (total_tickets_avail - total_tickets_sold) as current_avail_tickets from tbl_event where event_id = ? having current_avail_tickets >= ?;`, [event_id, qty]);
            if(rows && rows.length > 0){
                return true;
            } else{
                return false;
            }
        } catch(error){
            console.log(error);
            return false
        }
    }
}

module.exports = new Common()