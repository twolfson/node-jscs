var assert = require('assert');
var pathval = require('pathval');

function getNodeName(node) {
    if (node.type === 'Identifier') {
        return node.name;
    } else {
        return node.value;
    }
}

module.exports = function() {};

module.exports.prototype = {
    configure: function(requireNamedUnassignedFunctions) {
        assert(
            requireNamedUnassignedFunctions === true ||
            typeof requireNamedUnassignedFunctions === 'object',
            'requireNamedUnassignedFunctions option requires true value ' +
            'or an object with String[] `allExcept` property'
        );

        // verify first item in `allExcept` property in object (if it's an object)
        assert(
            typeof requireNamedUnassignedFunctions !== 'object' ||
            Array.isArray(requireNamedUnassignedFunctions.allExcept) &&
            typeof requireNamedUnassignedFunctions.allExcept[0] === 'string',
            'Property `allExcept` in requireNamedUnassignedFunctions should be an array of strings'
        );

        if (requireNamedUnassignedFunctions.allExcept) {
            this._allExceptItems = requireNamedUnassignedFunctions.allExcept.map(function(item) {
                var parts = pathval.parse(item).map(function extractPart (part) {
                    return part.i !== undefined ? part.i : part.p;
                });
                return JSON.stringify(parts);
            });
        }
    },

    getOptionName: function() {
        return 'requireNamedUnassignedFunctions';
    },

    check: function(file, errors) {
        var _this = this;
        file.iterateNodesByType(['FunctionExpression'], function(node) {
            var parentNode = node.parentNode;
            if (!parentNode.type.match(/VariableDeclarator|Property|AssignmentExpression/)) {
                if (node.id === null) {
                    if (_this._allExceptItems) {
                        if (parentNode.type === 'CallExpression') {
                            // memberNode covers both `it` in `it(function () {` and
                            //   `it.skip(function () {` after enough traversals
                            var memberNode = parentNode.callee;
                            var canBeRepresented = true;
                            var fullpathParts = [];
                            while (memberNode) {
                                if (memberNode.type.match(/Identifier|Literal/)) {
                                    fullpathParts.unshift(getNodeName(memberNode));
                                } else if (memberNode.type === 'MemberExpression') {
                                    fullpathParts.unshift(getNodeName(memberNode.property));
                                } else {
                                    canBeRepresented = false;
                                    break;
                                }
                                memberNode = memberNode.object;
                            }

                            if (canBeRepresented) {
                                var fullpath = JSON.stringify(fullpathParts);
                                for (var i = 0, l = _this._allExceptItems.length; i < l; i++) {
                                    if (fullpath === _this._allExceptItems[i]) {
                                        return;
                                    }
                                }
                            }
                        }
                    }

                    errors.add('Inline functions need to be named', node.loc.start);
                }
            }
        });
    }
};
