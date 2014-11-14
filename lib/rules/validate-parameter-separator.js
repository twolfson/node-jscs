var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(validateParameterSeparator) {
        assert(
            typeof validateParameterSeparator === 'string' && /^[ ]?,[ ]?$/.test(validateParameterSeparator),
            'validateParameterSpacing option requires string value containing only a comma and optional spaces'
        );

        this._separator = validateParameterSeparator;
    },

    getOptionName: function() {
        return 'validateParameterSeparator';
    },

    check: function(file, errors) {

        var separators = this._separator.split(',');
        var whitespaceBeforeComma = Boolean(separators.shift());
        var whitespaceAfterComma = Boolean(separators.pop());

        file.iterateNodesByType(['FunctionDeclaration', 'FunctionExpression'], function(node) {

            node.params.forEach(function(paramNode) {

                var prevParamToken = file.getFirstNodeToken(paramNode);
                var punctuatorToken = file.getNextToken(prevParamToken);

                if (punctuatorToken.value === ',') {

                    if (whitespaceBeforeComma) {
                        errors.assert.whitespaceBetween(
                            prevParamToken,
                            punctuatorToken,
                            'Missing space after function parameter \'' + prevParamToken.value + '\''
                        );
                    } else {
                        errors.assert.noWhitespaceBetween(
                            prevParamToken,
                            punctuatorToken,
                            'Unexpected space after function parameter \'' + prevParamToken.value + '\''
                        );
                    }

                    var nextParamToken = file.getNextToken(punctuatorToken);

                    if (whitespaceAfterComma) {
                        errors.assert.whitespaceBetween(
                            punctuatorToken,
                            nextParamToken,
                            'Missing space before function parameter \'' + nextParamToken.value + '\''
                        );
                    } else {
                        errors.assert.noWhitespaceBetween(
                            punctuatorToken,
                            nextParamToken,
                            'Unexpected space before function parameter \'' + nextParamToken.value + '\''
                        );
                    }
                }
            });
        });
    }

};
