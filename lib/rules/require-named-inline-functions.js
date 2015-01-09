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
    configure: function(requireNamedInlineFunctions) {
        assert(
            requireNamedInlineFunctions === true ||
            typeof requireNamedInlineFunctions === 'object',
            'requireNamedInlineFunctions option requires true value ' +
            'or an object'
        );

        // verify first item in `exceptFunction` property in object (if it's an object)
        assert(
            typeof requireNamedInlineFunctions !== 'object' ||
            (Array.isArray(requireNamedInlineFunctions.exceptFunctions) &&
            typeof requireNamedInlineFunctions.exceptFunctions[0] === 'string') ||
            (Array.isArray(requireNamedInlineFunctions.exceptMethods) &&
            typeof requireNamedInlineFunctions.exceptMethods[0] === 'string'),
            'Property `exceptFunction` in requireNamedInlineFunctions should be an array of strings'
        );

        if (requireNamedInlineFunctions.exceptFunction) {
            this._exceptFunctionItems = requireNamedInlineFunctions.exceptFunction.map(function(item) {
                var parts = pathval.parse(item).map(function extractPart (part) {
                    return part.i !== undefined ? part.i : part.p;
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
                    if (_this._exceptFunctionItems) {
                        var parentNode = node.parentNode;
                        if (parentNode && parentNode.type === 'CallExpression') {
                            // memberNode covers both `it` in `it(function () {` and `it.skip(function () {` after enough traversals
                            var memberNode = parentNode.callee;
                            var fullpathParts = [];
                            while (memberNode) {
                                if (memberNode.type.match(/Identifier|Literal/)) {
                                    fullpathParts.unshift(getNodeName(memberNode));
                                } else {
                                    fullpathParts.unshift(getNodeName(memberNode.property));
                                }
                                memberNode = memberNode.object;
                            }

                            var fullpath = JSON.stringify(fullpathParts);
                            for (var i = 0, l = _this._exceptFunctionItems.length; i < l; i++) {
                                if (fullpath === _this._exceptFunctionItems[i]) {
                                    return;
                                }
                            }
                        }
                    }
                    errors.add('Inline functions need to be named for stack traces', node.loc.start);
                }
            }
        });
    }
};
