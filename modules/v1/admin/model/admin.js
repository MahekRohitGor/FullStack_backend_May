const common = require("../../../../utils/common");
const database = require("../../../../config/database");
const response_code = require("../../../../utils/response-error-code");
const { t } = require('localizify');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const moment = require('moment');

class AdminModel {
    async login(request_data) {
        try {
            const is_login = await common.check_admin_login(request_data.email_id);
            if (!is_login) {
                const admin_details = await common.getAdmin(request_data.email_id);
                if (bcrypt.compareSync(request_data.password_, admin_details.password_)) {
                    const admin_token = jwt.sign(
                        { id: admin_details.admin_id },
                        process.env.JWT_SECRET,
                        { expiresIn: '1d' }
                    );
                    console.log(admin_token);

                    let update_data = {
                        last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                        is_login: 1
                    };

                    const updated_data = await common.updateAdminData(admin_details.admin_id, update_data);
                    if (updated_data) {
                        const adminInfo = await common.get_admin_info(admin_details.admin_id);
                        const response_data = {
                            adminInfo: adminInfo,
                            admin_token: admin_token
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
                        message: t('incorrect_password'),
                        data: null
                    }
                }

            } else {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('already_login'),
                    data: null
                }
            }

        } catch (error) {
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('internal_server_error'),
                data: null
            }
        }
    }

    async create_event(request_data) {
        try {
            const event_data = {
                event_title: request_data.event_title,
                event_desc: request_data.event_desc,
                event_address: request_data.event_address,
                event_price: request_data.event_price,
                total_tickets_avail: request_data.total_tickets_avail,
                event_date: request_data.event_date,
                total_tickets_sold: 0,
                latitude: '23.041000',
                longitude: '72.578537',
            }

            const [data] = await database.query(`INSERT INTO tbl_event SET ?`, [event_data]);
            if (data.affectedRows > 0) {
                return {
                    code: response_code.SUCCESS,
                    message: "Event Add Success",
                    data: data.insertId
                }
            }
            else {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "Failed To add Event",
                    data: null
                }
            }

        } catch (error) {
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('internal_server_error'),
                data: null
            }
        }
    }

    async edit_event(request_data) {
        try {
            const updated_fields = {};
            if (request_data.event_title) {
                updated_fields.event_title = request_data.event_title;
            }
            if (request_data.event_desc) {
                updated_fields.event_desc = request_data.event_desc;
            }
            if (request_data.event_address) {
                updated_fields.event_address = request_data.event_address;
            }
            if (request_data.event_price) {
                updated_fields.event_price = request_data.event_price;
            }
            if (request_data.total_tickets_avail) {
                updated_fields.total_tickets_avail = request_data.total_tickets_avail;
            }
            if (request_data.event_date) {
                updated_fields.event_date = request_data.event_date;
            }

            if (Object.keys(updated_fields).length === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t("no_data_provided_for_update"),
                    data: null
                }
            } else {
                const [upated_prods] = await database.query(`UPDATE tbl_event SET ? where event_id = ?`, [updated_fields, request_data.event_id]);
                if (upated_prods.affectedRows > 0) {
                    return {
                        code: response_code.SUCCESS,
                        message: t('update_product_success'),
                        data: { event_id: request_data.event_id }
                    }
                } else {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('update_product_failed'),
                        data: null
                    }
                }
            }

        } catch (error) {
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('internal_server_error'),
                data: null
            }
        }
    }

    async event_listing() {
        try {
            const [events] = await database.query(`select event_id, event_title, event_desc, CAST(event_date AS DATE) as event_date, CAST(event_date AS TIME) as event_time, event_address, latitude, longitude, event_price, total_tickets_avail, total_tickets_sold from tbl_event where is_active = 1 and is_deleted = 0`);

            if (events && events != null && Array.isArray(events) && events.length > 0) {
                return {
                    code: response_code.SUCCESS,
                    message: "Events Found",
                    data: events
                }
            } else {
                return {
                    code: response_code.NOT_FOUND,
                    message: "Events Not Found",
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

    async delete_event(request_data) {
        try {
            if (!request_data.event_id) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('no_event_id_provided'),
                    data: null
                }
            } else {
                const data = await common.get_event_info(request_data.event_id);
                if (data) {
                    const [res] = await database.query(`UPDATE tbl_event SET is_deleted = 1 where event_id = ?`, [request_data.event_id]);
                    if (res.affectedRows > 0) {
                        return {
                            code: response_code.SUCCESS,
                            message: t('delete_success'),
                            data: request_data.event_id
                        }
                    } else {
                        return {
                            code: response_code.OPERATION_FAILED,
                            message: t('delete_failed'),
                            data: null
                        }
                    }
                } else {
                    return {
                        code: response_code.NOT_FOUND,
                        message: t('event_already_deleted'),
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

    async upload_image(request_data) {
        try {
            const data = await common.get_event_info(request_data.event_id);
            if(data){
                const upload_data = {
                    event_id: request_data.event_id,
                    image_link: request_data.image_link
                }
                console.log("Upload Data: ", upload_data);

                const [rows] = await database.query(`INSERT INTO tbl_event_images SET ?`, [upload_data]);
                if(rows.affectedRows > 0){
                    return {
                        code: response_code.SUCCESS,
                        message: "Image Upload Success",
                        data: rows.insertId
                    }
                } else{
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: "Error while uploading images",
                        data: null
                    }
                }

            } else{
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "No Data Found for event",
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

    async show_analytics(){
        try{
            const [rows] = await database.query(`select event_id, event_title, event_desc, CAST(event_date AS DATE) as event_date, 
                                                CAST(event_date AS TIME) as event_time, total_tickets_avail, 
                                                total_tickets_sold as total_attendees, 
                                                (total_tickets_sold*event_price) as total_revenue_from_tickets_sold, 
                                                (total_tickets_avail - total_tickets_sold) as remaining_tickets from tbl_event where is_active = 1 and is_deleted = 0`);
            if(rows && rows.length > 0){
                return{
                    code: response_code.SUCCESS,
                    message: "Analytics Found",
                    data: rows
                }
            } else{
                return{
                    code: response_code.OPERATION_FAILED,
                    message: "Analytics Not Found",
                    data: null
                }
            }

        } catch(error){
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Internal Server Error",
                data: null
            }
        }
    }

}

module.exports = new AdminModel();