var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(disallowAnonymousFunctions) {
        assert(
            disallowAnonymousFunctions === true ||
            typeof disallowAnonymousFunctions === 'object',
            'disallowAnonymousFunctions option requires true value ' +
            'or an object with String[] `parameterExcept` property'
        );

        // verify first item in `parameterExcept` property in object (if it's an object)
        assert(
            typeof disallowAnonymousFunctions !== 'object' ||
            Array.isArray(disallowAnonymousFunctions.parameterExcept) &&
            typeof disallowAnonymousFunctions.parameterExcept[0] === 'string',
            'Property `parameterExcept` in disallowAnonymousFunctions should be an array of strings'
        );

    },

    getOptionName: function() {
        return 'disallowAnonymousFunctions';
    },

    check: function(file, errors) {
        file.iterateNodesByType(['FunctionExpression', 'FunctionDeclaration'], function(node) {
            if (node.id === null) {
                errors.add('Anonymous functions needs to be named', node.loc.start);
            }
        });
    }
};
