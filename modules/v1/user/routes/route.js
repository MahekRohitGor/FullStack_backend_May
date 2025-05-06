const users = require("../controller/user");

const user = (app) => {
    app.post("/v1/user/signup", users.signup);
    app.post("/v1/user/login", users.login);
    app.post("/v1/user/logout", users.logout);
    app.get("/v1/user/events/list", users.list_avail_events);
    app.get("/v1/user/events/:id", users.list_events_id);
    app.post("/v1/user/events/purchase", users.purchase_tickets);
    app.get("/v1/user/history", users.previous_purchases);
}

module.exports = user;