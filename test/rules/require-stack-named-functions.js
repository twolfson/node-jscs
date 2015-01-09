var Checker = require('../../lib/checker');
var assert = require('assert');

describe('rules/require-stack-named-functions', function() {
    var checker;

    beforeEach(function() {
        checker = new Checker();
        checker.registerDefaultRules();
    });

    describe('option value true', function() {
        beforeEach(function() {
            checker.configure({
                requireStackNamedFunctions: true
            });
        });

        it('should report on non-stack-named function declarations', function() {
            assert(checker.checkString('$("hi").click(function(){});').getErrorCount() === 1);
        });

        it('should not report on stack-named function expressions by left-hand assignment', function() {
            assert(checker.checkString('var x = function(){};').isEmpty());
            assert(checker.checkString('var foo = {bar: function() {}};').isEmpty());
            assert(checker.checkString('foo.bar = function() {};').isEmpty());
        });

        it('should not report on named function declarations', function() {
            assert(checker.checkString('function named(){};').isEmpty());
        });

        it('should not report on named function expressions', function() {
            assert(checker.checkString('$("hi").click(function named(){});').isEmpty());
            assert(checker.checkString('var x = function named(){};').isEmpty());
        });
    });
});
