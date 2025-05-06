const admins = require("../controller/admin");

const admin = (app) => {
    app.post("/v1/admin/login", admins.login);
    app.post("/v1/admin/event/create", admins.create_event);
    app.post("/v1/admin/event/edit", admins.edit_events);
    app.get("/v1/admin/event/list", admins.event_listing);
    app.delete("/v1/admin/event/delete", admins.delete_event);
    app.post("/v1/admin/event/upload", admins.upload_image);
    app.get("/v1/admin/dashboard", admins.show_analytics);
}

module.exports = admin;