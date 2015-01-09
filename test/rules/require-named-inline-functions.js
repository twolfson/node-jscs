var Checker = require('../../lib/checker');
var assert = require('assert');

describe('rules/require-named-inline-functions', function() {
    var checker;

    beforeEach(function() {
        checker = new Checker();
        checker.registerDefaultRules();
    });

    describe('option value true', function() {
        beforeEach(function() {
            checker.configure({
                requireNamedInlineFunctions: true
            });
        });

        it('should report on unnamed inline function declarations', function() {
            assert(checker.checkString('$("hi").click(function(){});').getErrorCount() === 1);
        });

        it('should not report named inline function expressions by left-hand assignment', function() {
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

    describe('option value allExcept', function() {
        beforeEach(function() {
            checker.configure({
                requireNamedInlineFunctions: {
                    allExcept: ['it', 'it.skip', 'x.y.z', 'x[1]', 'x[0].z']
                }
            });
        });

        it('should report on unnamed inline function declarations', function() {
            assert(checker.checkString('$("hi").click(function(){});').getErrorCount() === 1);
        });

        it('should not report named inline function expressions by left-hand assignment', function() {
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

        // TODO: How to handle `forEach`? (maybe as a method option type)
        it('should not report on excepted unnamed function expressions', function() {
            assert(checker.checkString('it(function (){});').isEmpty());
            assert(checker.checkString('it.skip(function () {});').isEmpty());
            assert(checker.checkString('x.y.z(function () {});').isEmpty());
            assert(checker.checkString('x[1](function () {});').isEmpty());
            assert(checker.checkString('x[0].z(function () {});').isEmpty());
        });

        it('should not report on excepted unnamed using other notation', function() {
            assert(checker.checkString('it[\'skip\'](function () {});').isEmpty());
        });
    });
});
