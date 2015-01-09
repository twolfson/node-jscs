var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(requireStackNamedFunctions) {
        assert(
            requireStackNamedFunctions === true ||
            typeof requireStackNamedFunctions === 'object',
            'requireStackNamedFunctions option requires true value ' +
            'or an object with String[] `allExcept` property'
        );

        // verify first item in `allExcept` property in object (if it's an object)
        assert(
            typeof requireStackNamedFunctions !== 'object' ||
            Array.isArray(requireStackNamedFunctions.allExcept) &&
            typeof requireStackNamedFunctions.allExcept[0] === 'string',
            'Property `allExcept` in requireStackNamedFunctions should be an array of strings'
        );

        // if (requireStackNamedFunctions.allExcept) {
        //     var allExcept = requireStackNamedFunctions.allExcept;
        //     this._allExceptIndex = [];
        //     for (var i = 0, l = allExcept.length; i < l; i++) {
        //         this._allExceptIndex[allExcept[i]] = true;
        //     }
        // }
    },

    getOptionName: function() {
        return 'requireStackNamedFunctions';
    },

    check: function(file, errors) {
        file.iterateNodesByType(['FunctionExpression', 'FunctionDeclaration'], function(node) {
            if (!node.parentNode || !node.parentNode.type.match(/VariableDeclarator|Property/)) {
                if (node.id === null) {
                    errors.add('Inline functions need to be named for stack traces', node.loc.start);
                }
            }
        });
    }
};
