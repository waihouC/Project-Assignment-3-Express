// import in caolan forms
const forms = require("forms");

// create shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

// add bootstrap4
var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { 
        object.widget.classes = []; 
    }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
        object.widget.classes.push('shadow-none');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';
    var widget = object.widget.toHTML(name, object);

    return '<div class="form-group row my-3">' + label + '<div class="col-9">' + widget + error + '</div></div>';
};

const createRegistrationForm = () => {
    return forms.create({
        'first_name': fields.string({
            label: 'First Name',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.maxlength(50)]
        }),
        'last_name': fields.string({
            label: 'Last Name',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.maxlength(50)]
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.email()]
        }),
        'contact': fields.tel({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.digits(), validators.minlength(8), validators.maxlength(8)]
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.minlength(8)]
        }),
        'confirm_password': fields.password({
            label: 'Confirm Password',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3 py-0']
            },
            validators: [validators.matchField('password')]
        })
    });
}

const createLoginForm = () => {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            }
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            }
        })
    });
}

const createEditProfileForm = () => {
    return forms.create({
        'first_name': fields.string({
            label: 'First Name',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.maxlength(50)]
        }),
        'last_name': fields.string({
            label: 'Last Name',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.maxlength(50)]
        }),
        'contact': fields.tel({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.digits(), validators.minlength(8), validators.maxlength(8)]
        }),
        'new_password': fields.password({
            label: 'New Password',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3 py-0']
            },
            validators: [validators.minlength(8)]
        }),
        'confirm_password': fields.password({
            label: 'Confirm New Password',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3 py-0']
            },
            validators: [validators.matchField('new_password', "Does not match new password."),
                (form, field, callback) => {
                    if (form.fields.new_password && !field.data) {
                        callback("Please confirm your password.");
                    } else {
                        callback();
                    }
                }]
        })
    });
}

const createProductForm = (categories, tags) => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.maxlength(100)]
        }),
        'description': fields.string({
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            widget: widgets.textarea()
        }),
        'image_url': fields.string({
            label: 'Image URL',
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            }
        }),
        'category_id': fields.string({
            label: 'Category',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            widget: widgets.select(),
            choices: categories
        }),
        'tags': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            widget: widgets.multipleSelect(),
            choices: tags
        }),
        'cost_regular': fields.string({
            label: 'Regular Price (cents)',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.integer()]
        }),
        'volume_regular': fields.string({
            label: 'Regular Volume (ml)',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.integer()]
        }),
        'cost_large': fields.string({
            label: 'Large Price (cents)',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.integer()]
        }),
        'volume_large': fields.string({
            label: 'Large Volume (ml)',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.integer()]
        })
    });
}

module.exports = { 
    createRegistrationForm,
    createLoginForm,
    createEditProfileForm,
    createProductForm,
    bootstrapField 
};