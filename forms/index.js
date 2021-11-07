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
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.maxlength(50)]
        }),
        'last_name': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            },
            validators: [validators.maxlength(50)]
        }),
        'email': fields.email({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3']
            }
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
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-form-label fw-bold col-3 py-0']
            },
            validators: [validators.matchField('password')]
        })
    })
}

const createLoginForm = () => {
    return forms.create({
        'email': fields.email({
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

module.exports = { 
    createRegistrationForm,
    createLoginForm,
    bootstrapField 
};