var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(disallowNamedUnassignedFunctions) {
        assert(
            disallowNamedUnassignedFunctions === true,
            'disallowNamedUnassignedFunctions option requires true value'
        );
    },

    getOptionName: function() {
        return 'disallowNamedUnassignedFunctions';
    },

    check: function(file, errors) {
        var _this = this;
        file.iterateNodesByType(['FunctionExpression'], function(node) {
            // If the function has been named via left hand assignment, skip it
            //   e.g. `var hello = function() {`, `foo.bar = function() {`
            if (node.parentNode.type.match(/VariableDeclarator|Property|AssignmentExpression/)) {
                return;
            }

            // If the function has not been named, skip it
            //   e.g. `[].forEach(function() {`
            if (node.id === null) {
                return;
            }

            // Otherwise, complain that it is being named
            errors.add('Inline functions cannot be named', node.loc.start);
        });
    }
};
