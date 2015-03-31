/**
 * Disallows multiple spaces between identifiers, keywords, and any other token
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowMultipleSpaces": true
 * ```
 *
 * ##### Valid
 * ```js
 * var x = "hello";
 * function y() {}
 * ```
 *
 * ##### Invalid
 * ```js
 * var x  = "hello";
 * function y() {}
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        assert(
            options === true,
            this.getOptionName() + ' option requires true value'
        );
    },

    getOptionName: function() {
        return 'disallowNamedUnassignedFunctions';
    },

    check: function(file, errors) {
        file.iterateNodesByType('FunctionExpression', function(node) {
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
