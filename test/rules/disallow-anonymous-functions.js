var Checker = require('../../lib/checker');
var assert = require('assert');

describe('rules/disallow-anonymous-functions', function() {
    var checker;

    beforeEach(function() {
        checker = new Checker();
        checker.registerDefaultRules();
    });

    describe('option value true', function() {
        beforeEach(function() {
            checker.configure({
                disallowAnonymousFunctions: true
            });
        });

        it('should report on anonymous function declarations', function() {
            assert(checker.checkString('$("hi").click(function(){});').getErrorCount() === 1);
        });

        it('should report on anonymous function expressions', function() {
            assert(checker.checkString('var x = function(){};').getErrorCount() === 1);
            assert(checker.checkString('var foo = {bar: function() {}};').getErrorCount() === 1);
        });

        it('should not report on named function declarations', function() {
            assert(checker.checkString('function named(){};').isEmpty());
        });

        it('should not report on named function expressions', function() {
            assert(checker.checkString('$("hi").click(function named(){});').isEmpty());
            assert(checker.checkString('var x = function named(){};').isEmpty());
        });
    });

    describe('option value parameterExcept', function() {
        beforeEach(function() {
            checker.configure({
                disallowAnonymousFunctions: {
                    parameterExcept: ['it']
                }
            });
        });

        it('should report on anonymous function declarations', function() {
            assert(checker.checkString('before(function(){});').getErrorCount() === 1);
        });

        it('should report on anonymous function expressions', function() {
            assert(checker.checkString('var x = function(){};').getErrorCount() === 1);
            assert(checker.checkString('var foo = {bar: function() {}};').getErrorCount() === 1);
        });

        it('should not report on excepted anonymous function declarations', function() {
            assert(checker.checkString('it(\'is an exception\', function(){});').isEmpty());
        });

        it('should not report on excepted properties that are anonymous function declarations', function() {
            assert(checker.checkString('suite.it(\'is an exception\', function(){});').isEmpty());
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
