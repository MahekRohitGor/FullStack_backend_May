const user = require("../model/user");
const common = require("../../../../utils/common");
const response_code = require("../../../../utils/response-error-code");
const { default: localizify } = require("localizify");
const validator = require("../../../../middlewares/validator");
const { t } = require("localizify");
const vrules = require("../../../validation_rules");

class User {
    async signup(req, res) {
        try {
            const requested_data = req.body;
            const request_data = common.decrypt(requested_data);

            const rules = vrules.signup;
            const message = {
                required: t('required'),
                email: t('email'),
                'password_.min': t('passwords_min'),
                string: t('must_be_string'),
            }
            const keywords = {
                'email_id': t('rest_keywords_email_id'),
                'password_': t('rest_keywords_password'),
                'full_name': t('rest_keywords_full_name'),
                'profile_pic': t('rest_keywords_profile'),
                'about': t('rest_keywords_about')
            }

            const isValid = await validator.checkValidationRules(req, res, request_data, rules, message, keywords);
            if (!isValid) return;

            const response = await user.signup(request_data);
            await common.sendEncryptedResponse(res, response_code.SUCCESS, response.message, response.data);

        } catch (error) {
            console.error("Signup Error:", error);
            return common.sendEncryptedResponse(
                res,
                response_code.INTERNAL_SERVER_ERROR,
                t("internal_server_error") || "Something went wrong, please try again later.",
                {}
            );
        }
    }

    async login(req, res) {
        try {
            const requested_data = req.body;
            const request_data = common.decrypt(requested_data);

            const rules = vrules.login;
            const message = {
                required: t('required'),
                email_id: t('email_id')
            }
            const keywords = {
                'email_id': t('rest_keywords_email_id'),
                'password_': t('rest_keywords_password')
            }

            const isValid = await validator.checkValidationRules(req, res, request_data, rules, message, keywords);
            if (!isValid) return;

            const response = await user.login(request_data);
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

    async logout(req,res){
            try{
                const user_id = req.owner_id;
                const response = await user.logout(user_id);
                await common.sendEncryptedResponse(res, response_code.SUCCESS, response.message, response.data);
            } catch(error){
                console.error("LOGOUT Error:", error);
                return common.sendEncryptedResponse(
                    res,
                    response_code.INTERNAL_SERVER_ERROR,
                    t("internal_server_error") || "Something went wrong, please try again later.",
                    {}
                );
            }
    }

    async list_avail_events(req,res){
        try{
            const response = await user.list_avail_events();
            await common.sendEncryptedResponse(res, response_code.SUCCESS, response.message, response.data);
        } catch(error){
            console.error("List Events Error:", error);
            return common.sendEncryptedResponse(
                res,
                response_code.INTERNAL_SERVER_ERROR,
                t("internal_server_error") || "Something went wrong, please try again later.",
                {}
            );
        }
    }

    async list_events_id(req,res){
        try{
            const response = await user.list_events_id(req.params.id);
            await common.sendEncryptedResponse(res, response_code.SUCCESS, response.message, response.data);
        } catch(error){
            console.error("List Events Error:", error);
            return common.sendEncryptedResponse(
                res,
                response_code.INTERNAL_SERVER_ERROR,
                t("internal_server_error") || "Something went wrong, please try again later.",
                {}
            );
        }
    }

    async purchase_tickets(req, res) {
        try {
            const requested_data = req.body;
            const user_id = req.owner_id;
            const request_data = common.decrypt(requested_data);
            console.log("Req Data:  ", request_data);

            const rules = vrules.purchase_tickets;
            const message = {
                required: t('required'),
                integer: t('must_be_integer'),
                min: t('minimum_value_required'),
                in: t('invalid_value_provided')
            }
            const keywords = {
                'qty': t('rest_keywords_qty'),
                'event_id': t('rest_keywords_event_id'),
                'payment_type': t('rest_keywords_payment_type')
            }

            const isValid = await validator.checkValidationRules(req, res, request_data, rules, message, keywords);
            if (!isValid) return;

            const response = await user.purchase_tickets(request_data, user_id);
            await common.sendEncryptedResponse(res, response_code.SUCCESS, response.message, response.data);

        } catch (error) {
            console.error("purchase_tickets Error:", error);
            return common.sendEncryptedResponse(
                res,
                response_code.INTERNAL_SERVER_ERROR,
                t("internal_server_error") || "Something went wrong, please try again later.",
                {}
            );
        }
    }

    async previous_purchases(req,res){
        try{
            const user_id = req.owner_id;
            const response = await user.previous_purchases(user_id);
            await common.sendEncryptedResponse(res, response_code.SUCCESS, response.message, response.data);
        } catch(error){
            console.error("previous_purchases Error:", error);
            return common.sendEncryptedResponse(
                res,
                response_code.INTERNAL_SERVER_ERROR,
                t("internal_server_error") || "Something went wrong, please try again later.",
                {}
            );
        }
}
}

module.exports = new User();