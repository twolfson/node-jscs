var Checker = require('../../lib/checker');
var assert = require('assert');

describe('rules/disallow-named-inline-functions', function() {
    var checker;

    beforeEach(function() {
        checker = new Checker();
        checker.registerDefaultRules();
    });

    describe('option value true', function() {
        beforeEach(function() {
            checker.configure({
                disallowNamedInlineFunctions: true
            });
        });

        it('should not report on unnamed inline function declarations', function() {
            assert(checker.checkString('$("hi").click(function(){});').isEmpty());
        });

        it('should not report named inline function expressions by left-hand assignment', function() {
            assert(checker.checkString('var x = function(){};').isEmpty());
            assert(checker.checkString('var foo = {bar: function() {}};').isEmpty());
            assert(checker.checkString('foo.bar = function() {};').isEmpty());
        });

        it('should not report on named function declarations', function() {
            assert(checker.checkString('function named(){};').isEmpty());
        });

        it('should report on named inline function expressions', function() {
            assert(checker.checkString('$("hi").click(function named(){});').getErrorCount() === 1);
        });

        it('should not report on named inline function expressions', function() {
            assert(checker.checkString('var x = function named(){};').isEmpty());
            assert(checker.checkString('var foo = {bar: function named() {}};').isEmpty());
            assert(checker.checkString('foo.bar = function named() {};').isEmpty());
        });
    });
});
