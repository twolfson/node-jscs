/**
 * Requires that a function expression be named.
 *
 * Type: `Boolean`
 *
 * Values: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowAnonymousFunctions": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = function foo(){
 *
 * };
 *
 * $('#foo').click(function bar(){
 *
 * });
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = function(){
 *
 * };
 *
 * $('#foo').click(function(){
 *
 * });
 * ```
 */

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

        if (disallowAnonymousFunctions.parameterExcept) {
            var parameterExcept = disallowAnonymousFunctions.parameterExcept;
            this._parameterExceptIndex = {};
            for (var i = 0, l = parameterExcept.length; i < l; i++) {
                this._parameterExceptIndex[parameterExcept[i]] = true;
            }
        }
    },

    getOptionName: function() {
        return 'disallowAnonymousFunctions';
    },

    check: function(file, errors) {
        var _this = this;
        file.iterateNodesByType(['FunctionExpression', 'FunctionDeclaration'], function(node) {
            if (node.id === null) {
                if (_this._parameterExceptIndex) {
                    var parentNode = node.parentNode;
                    if (parentNode && parentNode.type === 'CallExpression') {
                        var callee = parentNode.callee;
                        if (callee.type === 'Identifier') {
                            if (_this._parameterExceptIndex[callee.name]) {
                                return;
                            }
                        } else if (callee.type === 'MemberExpression') {
                            if (callee.property.type === 'Identifier') {
                                if (_this._parameterExceptIndex[callee.property.name]) {
                                    return;
                                }
                            }
                        }
                    }
                }

                errors.add('Anonymous functions needs to be named', node.loc.start);
            }
        });
    }
};
