const express = require("express");
const router = express.Router();

// import in the User model
const { User } = require('../models');
const { 
    createRegistrationForm,
    createLoginForm,
    bootstrapField
} = require('../forms');

// data layer
async function getUserByEmail(email) {
    let user = await User.where({
        'email': email
    }).fetch({
        require: false
    });

    return user;
}


// user registration
router.get('/register', (req, res) => {
    // display the registration form
    const registerForm = createRegistrationForm();
    res.render('users/register', {
        'form': registerForm.toHTML(bootstrapField)
    });
});

// submit user registration
router.post('/register', (req, res) => {
    const registerForm = createRegistrationForm();
    registerForm.handle(req, {
        success: async (form) => {
            // check for account with existing email
            let existingUser = await getUserByEmail(form.data.email);
            if (existingUser) {
                console.log("User exists.");
                req.flash("error_messages", "Account is an existing user.");
                res.redirect('/users/register');
            } else {
                const user = new User({
                    'first_name': form.data.first_name,
                    'last_name': form.data.last_name,
                    'email': form.data.email,
                    'contact': form.data.contact,
                    'password': form.data.password,
                    'created_on': new Date(),
                    'user_type_id': 3 // 'user' type
                });
                await user.save();
                req.flash("success_messages", "Account signed up successfully.");
                res.redirect('/users/login');
            }
        },
        'error': (form) => {
            res.render('users/register', {
                'form': form.toHTML(bootstrapField)
            });
        }
    });
});

// user login
router.get('/login', (req, res) => {
    const loginForm = createLoginForm();
    res.render('users/login', {
        'form': loginForm.toHTML(bootstrapField)
    });
});

// submit user login
router.post('/login', async (req, res) => {
    const loginForm = createLoginForm();
    loginForm.handle(req, {
        'success': async (form) => {
            // find user by email
            let user = await getUserByEmail(form.data.email);

            if (!user) {
                req.flash("error_messages", "Incorrect email or password.");
                res.redirect('/users/login');
            } else {
                // check if the password matches
                if (user.get('password') === form.data.password) {
                    // if matches, store user in client session
                    req.session.user = {
                        id: user.get('id'),
                        first_name: user.get('first_name'),
                        last_name: user.get('last_name'),
                        email: user.get('email'),
                        contact: user.get('contact'),
                        user_type_id: user.get('user_type_id')
                    };
                    
                    res.redirect('/users/profile');
                } else {
                    req.flash("error_messages", "Incorrect email or password.");
                    res.redirect('/users/login');
                }
            }
        },
        'error': (form) => {
            res.render('users/login', {
                'form': form.toHTML(bootstrapField)
            });
        }
    });
});

// user profile
router.get('/profile', (req, res) => {
    const user = req.session.user;

    if (!user) {
        req.flash('error_messages', 'You do not have permission to view this page.');
        res.redirect('/users/login');
    } else {
        res.render('users/profile', {
            'user': user
        });
    }
})

// update user profile


// user logout
router.get('/logout', async (req, res) => {
    let user = await getUserByEmail(req.session.user.email);

     // update last logged in
     user.set('last_logged_in', new Date());
     await user.save();

     req.session.user = null;
     res.redirect('/users/login');
})

module.exports = router;