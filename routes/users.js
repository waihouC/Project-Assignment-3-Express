const express = require("express");
const router = express.Router();

// import in the User model
const { User } = require('../models');

// import the forms
const { 
    createRegistrationForm,
    createLoginForm,
    createEditProfileForm,
    bootstrapField
} = require('../forms');

// import middleware
const { checkIfAuthenticated } = require('../middlewares');

// data service
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
router.post('/register', async (req, res) => {
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
router.get('/profile', checkIfAuthenticated, (req, res) => {
    res.render('users/profile');
});

// update user profile
router.get('/edit', checkIfAuthenticated, async (req, res) => {
    const userProfile = await getUserByEmail(req.session.user.email);

    let profileForm = createEditProfileForm();
    profileForm.fields.first_name.value = userProfile.get('first_name');
    profileForm.fields.last_name.value = userProfile.get('last_name');
    profileForm.fields.contact.value = userProfile.get('contact');

    res.render('users/edit', {
        'form': profileForm.toHTML(bootstrapField)
    });
});

// submit user profile
router.post('/edit', async (req, res) => {
    let userProfile = await getUserByEmail(req.session.user.email);

    let profileForm = createEditProfileForm();
    profileForm.handle(req, {
        'success': async function(form) {
            // validate if confirm password is not empty
            if (form.data.new_password) {
                if (!form.data.confirm_password) {
                    req.flash("error_messages", "Please confirm new password.");
                    res.redirect('/users/edit');
                    return;
                }
            }
            
            // validate new password is not same as old password
            if (form.data.new_password) {
                if (userProfile.get('password') === form.data.new_password) {
                    req.flash("error_messages", "New password cannot be the same as old password.");
                    res.redirect('/users/edit');
                    return;
                } else {
                    userProfile.set('password', form.data.new_password);
                }
            }
            
            // update other fields
            userProfile.set('first_name', form.data.first_name);
            userProfile.set('last_name', form.data.last_name);
            userProfile.set('contact', form.data.contact);
            
            await userProfile.save();

            // update user session
            req.session.user = {
                first_name: userProfile.get('first_name'),
                last_name: userProfile.get('last_name'),
                email: userProfile.get('email'),
                contact: userProfile.get('contact')
            };

            req.flash("success_messages", "User profile updated successfully.");
            res.redirect('/users/profile');
        },
        'error': (form) => {
            res.render('users/edit', {
                'form': form.toHTML(bootstrapField)
            });
        },
        'empty': (form) => {
            res.render('users/edit', {
                'form': form.toHTML(bootstrapField)
            });
        }
    });
});

// user logout
router.get('/logout', async (req, res) => {
    if (req.session.user) {
        let user = await getUserByEmail(req.session.user.email);

        // update last logged in
        user.set('last_logged_in', new Date());
        await user.save();
    }

    req.session.user = null;
    res.redirect('/users/login');
});

module.exports = router;