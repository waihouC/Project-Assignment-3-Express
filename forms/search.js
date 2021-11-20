// import in caolan forms
const forms = require("forms");

// create shortcuts
const fields = forms.fields;
const widgets = forms.widgets;

// add bootstrap4
var searchBootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { 
        object.widget.classes = []; 
    }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
        object.widget.classes.push('form-control-lg');
        object.widget.classes.push('shadow-none');
    }

    var widget = object.widget.toHTML(name, object);

    return '<div class="input-group">'
                + '<button class="btn btn-light btn-outline-secondary" type="submit" aria-label="Search"><i class="bi bi-search"></i></button>'
                + widget 
                + '</div>';
};

const createSearchForm = () => {
    return forms.create({
        'search_query': fields.string({
            required: true,
            errorAfterField: false,
            widget: widgets.text({ type: ['search'] })
        })
    });
};

module.exports = {
    createSearchForm,
    searchBootstrapField
}