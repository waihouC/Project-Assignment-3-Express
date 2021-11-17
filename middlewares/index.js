const checkIfAuthenticatedAsAdmin = function(req, res, next) {
    if (req.session.user && req.session.user.user_type_id == 1) {
        next();
    } else {
        req.flash('error_messages', "You do not have permission to view this page.");
        res.redirect('/users/login');
    }
}

const checkIfAuthenticatedAsAdminOrMgr = function(req, res, next) {
    if (req.session.user && (req.session.user.user_type_id == 1 || req.session.user.user_type_id == 2)) {
        next();
    } else {
        req.flash('error_messages', "You do not have permission to view this page.");
        res.redirect('/users/login');
    }
}

const checkIfAuthenticated = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.flash('error_messages', "You must log in to view this page.");
        res.redirect('/users/login');
    }
}

module.exports = { 
    checkIfAuthenticatedAsAdmin,
    checkIfAuthenticatedAsAdminOrMgr,
    checkIfAuthenticated
}