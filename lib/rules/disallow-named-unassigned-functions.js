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
            if (!node.parentNode || !node.parentNode.type.match(/VariableDeclarator|Property|AssignmentExpression/)) {
                if (node.id !== null) {
                    errors.add('Inline functions cannot be named', node.loc.start);
                }
            }
        });
    }
};
