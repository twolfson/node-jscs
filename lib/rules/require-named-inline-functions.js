var assert = require('assert');
var pathval = require('pathval');

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

        if (requireNamedInlineFunctions.allExcept) {
            this._allExceptItems = requireNamedInlineFunctions.allExcept.map(pathval.parse);
        }
    },

    getOptionName: function() {
        return 'requireNamedInlineFunctions';
    },

    check: function(file, errors) {
        var _this = this;
        file.iterateNodesByType(['FunctionExpression'], function(node) {
            if (!node.parentNode || !node.parentNode.type.match(/VariableDeclarator|Property|AssignmentExpression/)) {
                if (node.id === null) {
                    if (_this._allExceptItems) {
                        console.log(_this._allExceptItems);
                    }
                    errors.add('Inline functions need to be named for stack traces', node.loc.start);
                }
            }
        });
    }
};
