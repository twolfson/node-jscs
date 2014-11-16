var assert = require('assert');
var sinon = require('sinon');
var esprima = require('esprima');
var JsFile = require('../lib/js-file');
var TokenAssert = require('../lib/token-assert');

describe('modules/token-assert', function() {
    describe('whitespaceBetween', function() {
        it('should trigger error on missing whitespace between tokens', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.whitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(onError.calledOnce);

            var error = onError.getCall(0).args[0];
            assert.equal(error.message, 'Missing space between x and =');
            assert.equal(error.line, 1);
            assert.equal(error.column, 1);
        });

        it('should accept message for missing whitespace between tokens', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.whitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1],
                message: 'Custom message'
            });

            assert(onError.getCall(0).args[0].message, 'Custom message');
        });

        it('should not trigger error on existing whitespace between tokens', function() {
            var file = createJsFile('x = y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.whitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(!onError.calledOnce);
        });

        it('should trigger error on invalid space count between tokens', function() {
            var file = createJsFile('x   =   y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.whitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1],
                spaces: 2
            });

            assert(onError.calledOnce);

            var error = onError.getCall(0).args[0];
            assert.equal(error.message, '2 spaces required between x and =');
            assert.equal(error.line, 1);
            assert.equal(error.column, 1);
        });

        it('should not trigger error on valid space count between tokens', function() {
            var file = createJsFile('x   =   y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.whitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1],
                spaces: 3
            });

            assert(!onError.calledOnce);
        });

        it('should accept message for invalid space count between tokens', function() {
            var file = createJsFile('x   =   y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.whitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1],
                spaces: 2,
                message: 'Custom message'
            });

            assert(onError.getCall(0).args[0].message, 'Custom message');
        });
    });

    describe('noWhitespaceBetween', function() {
        it('should trigger error on existing whitespace between tokens', function() {
            var file = createJsFile('x = y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noWhitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(onError.calledOnce);

            var error = onError.getCall(0).args[0];
            assert.equal(error.message, 'Unexpected whitespace between x and =');
            assert.equal(error.line, 1);
            assert.equal(error.column, 1);
        });

        it('should not trigger error on newline between tokens', function() {
            var file = createJsFile('x\n=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noWhitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(!onError.calledOnce);
        });

        it('should trigger error on newline between tokens with disallowNewLine option', function() {
            var file = createJsFile('x\n=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noWhitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1],
                disallowNewLine: true
            });

            assert(onError.calledOnce);

            var error = onError.getCall(0).args[0];
            assert.equal(error.message, 'Unexpected whitespace between x and =');
            assert.equal(error.line, 1);
            assert.equal(error.column, 1);
        });

        it('should not trigger error on missing whitespace between tokens', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noWhitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(!onError.calledOnce);
        });

        it('should accept message for existing space count between tokens', function() {
            var file = createJsFile('x = y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noWhitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1],
                message: 'Custom message'
            });

            assert(onError.getCall(0).args[0].message, 'Custom message');
        });
    });

    function createJsFile(sources) {
        return new JsFile(
            'example.js',
            sources,
            esprima.parse(sources, {loc: true, range: true, comment: true, tokens: true})
        );
    }
});
