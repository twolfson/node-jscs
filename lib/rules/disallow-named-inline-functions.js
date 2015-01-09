var assert = require('assert');

function getNodeName(node) {
    if (node.type === 'Identifier') {
        return node.name;
    } else {
        return node.value;
    }
}

module.exports = function() {};

module.exports.prototype = {
    configure: function(disallowNamedInlineFunctions) {
        assert(
            disallowNamedInlineFunctions === true,
            'disallowNamedInlineFunctions option requires true value'
        );
    },

    getOptionName: function() {
        return 'disallowNamedInlineFunctions';
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
