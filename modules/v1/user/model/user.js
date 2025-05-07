const common = require("../../../../utils/common");
const database = require("../../../../config/database");
const response_code = require("../../../../utils/response-error-code");
const { t } = require('localizify');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const moment = require('moment');
const {ticketConfirmationEmail} = require("../../../../template");


class UserModel {
    async signup(request_data) {
        try {
            const checkEmailUnique = await common.check_email(request_data.email_id);
            if (checkEmailUnique) {
                const signup_data = {
                    full_name: request_data.full_name,
                    email_id: request_data.email_id,
                    password_: bcrypt.hashSync(request_data.password_, 10),
                    profile_pic: request_data.profile_pic,
                    about: request_data.about,
                    is_profile_completed: 1
                }
                const [data] = await database.query(`INSERT INTO tbl_user SET ?`, [signup_data]);

                if (!data.insertId) {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('user_register_failed'),
                        data: null
                    }
                } else {
                    const user_id = data.insertId;
                    const user_token = jwt.sign({ id: user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                    const user_info = await common.get_user_info(user_id);
                    if (user_info) {
                        const response_data = {
                            userInfo: user_info,
                            user_token: user_token
                        }

                        return {
                            code: response_code.SUCCESS,
                            message: "Signup successfully",
                            data: response_data
                        };

                    } else {
                        return {
                            code: response_code.OPERATION_FAILED,
                            message: "error_while_signup",
                            data: null
                        };
                    }
                }

            } else {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('email_already_exists'),
                    data: null
                }
            }

        } catch (error) {
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Internal Server Error",
                data: null
            }
        }
    }

    async login(request_data) {
        try {
            const not_existing_user = await common.check_email(request_data.email_id);

            if (not_existing_user) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('invalid_email'),
                    data: null
                }
            } else {
                const is_login = await common.check_user_login(request_data.email_id);
                if (is_login) {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('already_login'),
                        data: null
                    }
                }
                const userDetails = await common.getUser(request_data.email_id);
                if (bcrypt.compareSync(request_data.password_, userDetails.password_)) {
                    if (userDetails.is_active == 1) {
                        const user_token = jwt.sign(
                            { id: userDetails.user_id },
                            process.env.JWT_SECRET,
                            { expiresIn: '1d' }
                        );
                        console.log(user_token);

                        let update_data = {
                            last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                            is_login: 1
                        };

                        const updated_data = await common.updateUserData(userDetails.user_id, update_data);
                        if (updated_data) {
                            const userInfo = await common.get_user_info(userDetails.user_id);
                            const response_data = {
                                userInfo: userInfo,
                                user_token: user_token
                            }

                            return {
                                code: response_code.SUCCESS,
                                message: 'login_success',
                                data: response_data
                            };

                        } else {
                            return {
                                code: response_code.OPERATION_FAILED,
                                message: t('error_updating_data'),
                                data: null
                            }
                        }

                    } else {
                        return {
                            code: response_code.OPERATION_FAILED,
                            message: t('inactive_account'),
                            data: null
                        }
                    }

                } else {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('invalid_password'),
                        data: null
                    }
                }
            }

        } catch (error) {
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Internal Server Error",
                data: null
            }
        }
    }

    async logout(user_id) {
        try {
            console.log(user_id);
            const user_data = await common.get_user_info(user_id);
            if (user_data) {
                const [data] = await database.query(`UPDATE tbl_user set is_login = 0 where user_id = ?`, [user_id]);
                if (data.affectedRows > 0) {
                    return {
                        code: response_code.SUCCESS,
                        message: "Logout Success",
                        data: user_id
                    }
                } else {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: "Failed to Update User Login Status",
                        data: null
                    }
                }
            }
            else {
                return {
                    code: response_code.NOT_FOUND,
                    message: "User Not Found",
                    data: null
                }
            }

        } catch (error) {
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Internal Server Error",
                data: null
            }
        }
    }

    async list_avail_events() {
        try {
            const [rows] = await database.query(`select e.event_id, e.event_title, e.event_desc, CAST(e.event_date AS DATE) as event_date, CAST(e.event_date AS TIME) as event_time, e.event_address, e.latitude, e.longitude, e.event_price, e.total_tickets_avail, group_concat(ei.image_link) as images, e.total_tickets_sold from tbl_event e left join tbl_event_images ei on ei.event_id = e.event_id where now() < e.event_date and e.is_deleted = 0 and e.is_active = 1 group by e.event_id;`);

            if (rows && rows.length > 0) {
                return {
                    code: response_code.SUCCESS,
                    message: t("Data_Found"),
                    data: rows
                }
            } else {
                return {
                    code: response_code.NOT_FOUND,
                    message: t("Data_Not_Found"),
                    data: null
                }
            }

        } catch (error) {
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Internal Server Error",
                data: null
            }
        }
    }

    async list_events_id(event_id) {
        try {
            const [rows] = await database.query(`select e.event_id, e.event_title, e.event_desc, CAST(e.event_date AS DATE) as event_date, CAST(e.event_date AS TIME) as event_time, e.event_address, e.latitude, e.longitude, e.event_price, e.total_tickets_avail, group_concat(ei.image_link) as images, e.total_tickets_sold from tbl_event e left join tbl_event_images ei on ei.event_id = e.event_id where now() < e.event_date and e.event_id = ? and e.is_deleted = 0 and e.is_active = 1 group by e.event_id;`, [event_id]);

            if (rows && rows.length > 0) {
                return {
                    code: response_code.SUCCESS,
                    message: t("Data_Found"),
                    data: rows[0]
                }
            } else {
                return {
                    code: response_code.NOT_FOUND,
                    message: t("Data_Not_Found"),
                    data: null
                }
            }
        } catch (error) {
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Internal Server Error",
                data: null
            }
        }
    }

    async purchase_tickets(request_data, user_id) {
        try {
            const is_event = await common.check_event(request_data.event_id);
            const is_qty_avail = await common.check_avail_tickts(request_data.qty, request_data.event_id);
            if (is_event) {
                if (is_qty_avail) {
                    const price = await common.get_event_price(request_data.event_id);
                    if (price) {
                        const send_data = {
                            user_id: user_id,
                            event_id: request_data.event_id,
                            purchase_status: "completed",
                            payment_type: request_data.payment_type,
                            qty: request_data.qty || 1,
                            amount: request_data.qty * price,
                            qrcode: common.generateRandomCode(16)
                        }

                        const [rows] = await database.query(`INSERT INTO tbl_purchase SET ?`, [send_data]);
                        if (rows.insertId) {
                            const userInfo = await common.get_user_info(user_id);
                            console.log("before")
                            const eventInfo = await common.get_event_info(request_data.event_id);

                            const subject = "Tickets Successfuly purchased";
                            const email = userInfo.email_id;

                            const ticket_data = {
                                full_name: userInfo.full_name,
                                email_id: userInfo.email_id,
                                event_title: eventInfo.event_title,
                                event_desc: eventInfo.event_desc,
                                event_date: eventInfo.event_date,
                                event_time: eventInfo.event_time,
                                event_address: eventInfo.event_address,
                                qrcode: send_data.qrcode
                            }

                            try {
                                const htmlMessage = ticketConfirmationEmail(ticket_data);
                                const resp = await common.sendMail(subject, email, htmlMessage);
                                console.log("Response: ", resp);
                                console.log("Email sent successfully!");
                            } catch (error) {
                                console.error("Error sending email:", error);
                            }

                            return {
                                code: response_code.SUCCESS,
                                message: "Purchase Successful",
                                data: rows.insertId
                            }
                        } else {
                            return {
                                code: response_code.OPERATION_FAILED,
                                message: "Purchase Failed",
                                data: null
                            }
                        }
                    } else {
                        console.log(error.message);
                        return {
                            code: response_code.OPERATION_FAILED,
                            message: "Internal Server Error",
                            data: null
                        }
                    }
                }
                else {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: "Qty of tickets unavailable",
                        data: null
                    }
                }
            } else {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "Event Does Not Exists",
                    data: null
                }
            }

        } catch (error) {
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Internal Server Error",
                data: null
            }
        }
    }

    async previous_purchases(user_id) {
        try {
            const [rows] = await database.query(`select p.purchase_id, p.user_id, p.amount, p.purchase_status, 
                    p.payment_type, p.qty, p.qrcode, e.event_desc, e.event_title, CAST(e.event_date AS DATE) as event_date, 
                    CAST(e.event_date AS TIME) as event_time, e.latitude, e.longitude
                    from tbl_purchase p inner join tbl_event e on e.event_id = p.event_id where p.purchase_status = "completed" and user_id = ? and e.is_deleted = 0 and e.is_active = 1;`, [user_id]);
            
            if(rows && rows.length > 0){
                return {
                    code: response_code.SUCCESS,
                    message: "Order History Found",
                    data: rows
                }
            } else{
                return {
                    code: response_code.SUCCESS,
                    message: "Order History Not Found",
                    data: null
                }
            }
        } catch (error) {
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Internal Server Error",
                data: null
            }
        }
    }
}

module.exports = new UserModel();