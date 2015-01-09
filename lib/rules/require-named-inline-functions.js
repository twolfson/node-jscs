var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(requireNamedInlineFunctions) {
        assert(
            requireNamedInlineFunctions === true ||
            typeof requireNamedInlineFunctions === 'object',
            'requireNamedInlineFunctions option requires true value ' +
            'or an object with String[] `allExcept` property'
        );

        // verify first item in `allExcept` property in object (if it's an object)
        assert(
            typeof requireNamedInlineFunctions !== 'object' ||
            Array.isArray(requireNamedInlineFunctions.allExcept) &&
            typeof requireNamedInlineFunctions.allExcept[0] === 'string',
            'Property `allExcept` in requireNamedInlineFunctions should be an array of strings'
        );

        // if (requireNamedInlineFunctions.allExcept) {
        //     var allExcept = requireNamedInlineFunctions.allExcept;
        //     this._allExceptIndex = [];
        //     for (var i = 0, l = allExcept.length; i < l; i++) {
        //         this._allExceptIndex[allExcept[i]] = true;
        //     }
        // }
    },

    getOptionName: function() {
        return 'requireNamedInlineFunctions';
    },

    check: function(file, errors) {
        file.iterateNodesByType(['FunctionExpression', 'FunctionDeclaration'], function(node) {
            if (!node.parentNode || !node.parentNode.type.match(/VariableDeclarator|Property|AssignmentExpression/)) {
                if (node.id === null) {
                    errors.add('Inline functions need to be named for stack traces', node.loc.start);
                }
            }
        });
    }
};
