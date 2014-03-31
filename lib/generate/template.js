var swig = require('swig');
var path = require('path');
var _ = require("lodash");

var parse = require("../parse");

var fs = require('./fs');

// return a templeter for page
var initTemplate = function(options) {
    var tpl = swig.compileFile(path.resolve(__dirname, '../../templates/page.html'));

    options = _.defaults(options || {}, {
        // Base folder for input
        root: "./",

        // Base folder for output
        output: "./",

        // Locals for templates
        locals: {}
    });

    return function(input, output, local) {
        input = path.join(options.root, input);
        output = path.join(options.output, output);

        // Read markdown file
        return fs.readFile(input, "utf-8")

        // Parse sections
        .then(function(markdown) {
            return parse.page(markdown);
        })

        //Calcul template
        .then(function(sections) {
            return tpl(
                _.extend(local || {}, options.locals, {
                    _input: input,
                    content: sections
                })
            );
        })

        // Write html
        .then(function(html) {
            return fs.writeFile(output, html);
        })
    }
};

module.exports = initTemplate;