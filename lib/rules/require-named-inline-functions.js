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
            this._allExceptItems = requireNamedInlineFunctions.allExcept.map(function(item) {
                var parts = pathval.parse(item).map(function extractPart (part) {
                    return part.i || part.p;
                });
                return JSON.stringify(parts);
            });
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
                        var parentNode = node.parentNode;
                        if (parentNode && parentNode.type === 'CallExpression') {
                            var fullpathParts = [];
                            if (parentNode.callee.type === 'Identifier') {
                                fullpathParts = [parentNode.callee.name];
                            }

                            var fullpath = JSON.stringify(fullpathParts);
                            for (var i = 0, l = _this._allExceptItems.length; i < l; i++) {
                                if (fullpath === _this._allExceptItems[i]) {
                                    return;
                                }
                            }
                            console.log(_this._allExceptItems);
                        }
                    }
                    errors.add('Inline functions need to be named for stack traces', node.loc.start);
                }
            }
        });
    }
};
