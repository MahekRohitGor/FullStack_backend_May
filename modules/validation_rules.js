const rules = {
    signup: {
        email_id: "required|email",
        password_: "required|min:8",
        full_name: "required",
        profile_pic: "required|string",
        about: "required|string"
    },

    login: {
        email_id: "required|email",
        password_: "required"
    },
    
    admin_login:{
        username: "required",
        password: "required"
    },

    purchase_tickets:{
        qty: "required|integer",
        event_id: "required|integer",
        payment_type: "required|string|in:cod,debit,credit,upi"
    },
    create_event: {
        event_title: "required|string",
        event_desc: "required|string",
        event_address: "required|string",
        event_price: "required|numeric",
        total_tickets_avail: "required|integer",
        event_date: "required"
    },
    edit_events: {
        event_id: "required",
        event_title: "string",
        event_desc: "string",
        event_address: "string",
        event_price: "nullable|numeric",
        total_tickets_avail: "integer",
        event_date: "required"
    },
    delete_event: {
        event_id: "required|numeric"
    },
    upload_image: {
        event_id: "required|numeric",
        image_link: "required|string"
    }
}

module.exports = rules;