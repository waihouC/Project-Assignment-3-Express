const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf');
const cors = require('cors');

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// register handlebars helpers
hbs.handlebars.registerHelper('calcPrice', function(price) {
    return (price / 100).toFixed(2);
});

hbs.handlebars.registerHelper('IsAdmin', function(user, options) {
    if (user && user.user_type_id == 1) {
        return options.fn(this);
    }
    
    return options.inverse(this);
});

hbs.handlebars.registerHelper('IsManager', function(user, options) {
    if (user && (user.user_type_id == 1 || user.user_type_id == 2)) {
        return options.fn(this);
    }
    
    return options.inverse(this);
});

// enable forms
app.use(
    express.urlencoded({
        extended: false
    })
);

// enable cors
app.use(cors());

// set up session
app.use(session({
    'store': new FileStore(),
    'secret': process.env.SESSION_SECRET_KEY,
    'resave': false,
    'saveUninitialized': true
}));

// setup flash
app.use(flash());

// register flash middleware
app.use(function(req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
});

// enable CSRF
app.use(csrf());

// middleware to share CSRF with hbs files
app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// middleware to share user data with hbs files
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
});

// import routes
const landingRoutes = require('./routes/landing');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

async function main() {
    app.use('/', landingRoutes);
    app.use('/users', userRoutes);
    app.use('/products', productRoutes);
}

main();

app.listen(3000, () => {
    console.log("Server has started");
});