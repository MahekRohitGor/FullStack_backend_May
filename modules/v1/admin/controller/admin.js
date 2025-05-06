const admin = require("../model/admin");
const common = require("../../../../utils/common");
const response_code = require("../../../../utils/response-error-code");
const { default: localizify } = require("localizify");
const validator = require("../../../../middlewares/validator");
const { t } = require("localizify");
const vrules = require("../../../validation_rules");

class Admin {
    async login(req, res) {
        try {
            const requested_data = req.body;
            const request_data = common.decrypt(requested_data);

            const rules = vrules.login;
            const message = {
                required: t('required'),
                email_id: t('email_id_valid_format')
            }
            const keywords = {
                'email_id': t('rest_keywords_email_id'),
                'password_': t('rest_keywords_password')
            }

            const isValid = await validator.checkValidationRules(req, res, request_data, rules, message, keywords);
            if (!isValid) return;

            const response = await admin.login(request_data);
            await common.sendEncryptedResponse(res, response_code.SUCCESS, response.message, response.data);
        } catch (error) {
            console.error("LOGIN Error:", error);
            return common.sendEncryptedResponse(
                res,
                response_code.INTERNAL_SERVER_ERROR,
                t("internal_server_error") || "Something went wrong, please try again later.",
                {}
            );
        }
    }

    async create_event(req, res) {
        try {
            const requested_data = req.body;
            const request_data = common.decrypt(requested_data);

            const rules = vrules.create_event;
            const message = {
                required: t('required'),
                string: t('must_be_string'),
                numeric: t('must_be_numeric'),
                integer: t('must_be_integer')
            };

            const keywords = {
                'event_title': t('rest_keywords_event_title'),
                'event_desc': t('rest_keywords_event_desc'),
                'event_address': t('rest_keywords_event_address'),
                'event_price': t('rest_keywords_event_price'),
                'total_tickets_avail': t('rest_keywords_total_tickets_avail'),
                'event_date': t('rest_keywords_event_date')
            };

            const isValid = await validator.checkValidationRules(req, res, request_data, rules, message, keywords);
            if (!isValid) return;

            const response = await admin.create_event(request_data);
            await common.sendEncryptedResponse(res, response_code.SUCCESS, response.message, response.data);

        } catch (error) {
            console.error("Create Event Error:", error);
            return common.sendEncryptedResponse(
                res,
                response_code.INTERNAL_SERVER_ERROR,
                t("internal_server_error") || "Something went wrong, please try again later.",
                {}
            );
        }
    }

    async edit_events(req, res) {
        try {
            const requested_data = req.body;
            const request_data = common.decrypt(requested_data);

            const rules = vrules.edit_events;
            const message = {
                required: t('required'),
                string: t('must_be_string'),
                numeric: t('must_be_numeric'),
                integer: t('must_be_integer')
            };

            const keywords = {
                'event_id': t('rest_keywords_event_id'),
                'event_title': t('rest_keywords_event_title'),
                'event_desc': t('rest_keywords_event_desc'),
                'event_address': t('rest_keywords_event_address'),
                'event_price': t('rest_keywords_event_price'),
                'total_tickets_avail': t('rest_keywords_total_tickets_avail'),
                'event_date': t('rest_keywords_event_date')
            };

            const isValid = await validator.checkValidationRules(req, res, request_data, rules, message, keywords);
            if (!isValid) return;

            const response = await admin.edit_event(request_data);
            await common.sendEncryptedResponse(res, response_code.SUCCESS, response.message, response.data);

        } catch (error) {
            console.error("Edit Product Error:", error);
            return common.sendEncryptedResponse(
                res,
                response_code.INTERNAL_SERVER_ERROR,
                t("internal_server_error") || "Something went wrong, please try again later.",
                {}
            );
        }
    }

    async event_listing(req, res) {
        try {
            const response = await admin.event_listing();
            await common.sendEncryptedResponse(res, response_code.SUCCESS, response.message, response.data);
        } catch (error) {
            console.error("Event Listing Error:", error.message);
            return common.sendEncryptedResponse(
                res,
                response_code.INTERNAL_SERVER_ERROR,
                t("internal_server_error") || "Something went wrong, please try again later.",
                {}
            );
        }
    }

    async delete_event(req, res) {
        try {
            const requested_data = req.body;
            const request_data = common.decrypt(requested_data);

            const rules = vrules.delete_event;
            const message = {
                numeric: t('must_be_numeric'),
                required: t('required')
            };

            const keywords = {
                'event_id': t('rest_keywords_event_id')
            };

            const isValid = await validator.checkValidationRules(req, res, request_data, rules, message, keywords);
            if (!isValid) return;

            const response = await admin.delete_event(request_data);
            await common.sendEncryptedResponse(res, response_code.SUCCESS, response.message, response.data);

        } catch (error) {
            console.error("Delete Event Error:", error);
            return common.sendEncryptedResponse(
                res,
                response_code.INTERNAL_SERVER_ERROR,
                t("internal_server_error") || "Something went wrong, please try again later.",
                {}
            );
        }
    }

    async upload_image(req, res) {
        try {
            const requested_data = req.body;
            const request_data = common.decrypt(requested_data);

            const rules = vrules.upload_image;
            const message = {
                numeric: t('must_be_numeric'),
                required: t('required'),
                string: t('must_be_string'),
            };

            const keywords = {
                'event_id': t('rest_keywords_event_id'),
                'image_link': t('rest_keywords_image_link')
            };

            const isValid = await validator.checkValidationRules(req, res, request_data, rules, message, keywords);
            if (!isValid) return;

            const response = await admin.upload_image(request_data);
            await common.sendEncryptedResponse(res, response_code.SUCCESS, response.message, response.data);

        } catch (error) {
            console.error("Upload Image Error:", error);
            return common.sendEncryptedResponse(
                res,
                response_code.INTERNAL_SERVER_ERROR,
                t("internal_server_error") || "Something went wrong, please try again later.",
                {}
            );
        }
    }

    async show_analytics(req, res) {
        try {
            const response = await admin.show_analytics();
            await common.sendEncryptedResponse(res, response_code.SUCCESS, response.message, response.data);
        } catch (error) {
            console.error("Show Analytics Error:", error);
            return common.sendEncryptedResponse(
                res,
                response_code.INTERNAL_SERVER_ERROR,
                t("internal_server_error") || "Something went wrong, please try again later.",
                {}
            );
        }
    }

}

module.exports = new Admin();