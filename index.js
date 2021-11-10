const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

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

// enable forms
app.use(
    express.urlencoded({
        extended: false
    })
);

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
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
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