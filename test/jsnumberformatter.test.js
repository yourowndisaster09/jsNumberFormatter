// requires
var assert = require('assert');
var nf = require('../jsnumberformatter.js').nf;

// tests
describe('parseNumberSimple', function() {
    describe('Positive Tests', function() {
        describe('Test1-Parse', function() {
            it('Parse to 1', function() {
                var options = new nf.parseNumberSimpleOptions();
                var number = nf.parseNumberSimple('1.00', options, true);
                assert.equal(number, 1);
            });
        });
        
        describe('Test2-Trim', function() {
            it('Parse to 1', function() {
                var options = new nf.parseNumberSimpleOptions().specifyAll('.', ',', false, true, false);
                var number = nf.parseNumberSimple(' 1.00 ', options, true);
                assert.equal(number, 1);
            });
        });
        
        describe('Test3-RemoveBadCh', function() {
            it('Parse to 1', function() {
                var options = new nf.parseNumberSimpleOptions().specifyAll('.', ',', false, false, true);
                var number = nf.parseNumberSimple('/1k.0l0!', options, true);
                assert.equal(number, 1);
            });
        });
        
        describe('Test4-FullParse', function() {
            it('Parse to -1000123.45', function() {
                var options = new nf.parseNumberSimpleOptions();
                var number = nf.parseNumberSimple('-1,000,123.45', options, true);
                assert.equal(number, -1000123.45);
            });
        });
        
        describe('Test5-ParseNegative', function() {
            it('Parse to -1000123.45', function() {
                var options = new nf.parseNumberSimpleOptions().specifyAll('.', ',', false, false, false, '^\\(([^\\)]+)\\)$');
                var number = nf.parseNumberSimple('(1,000,123.45)', options, true);
                assert.equal(number, -1000123.45);
            });
        });
        
        describe('Test6-ParseNegativeBadChars', function() {
            it('Parse to -1000123.45', function() {
                var options = new nf.parseNumberSimpleOptions().specifyAll('.', ',', false, false, true, '^.*-(.+)');
                var number = nf.parseNumberSimple('$-1,000,123.45', options, true);
                assert.equal(number, -1000123.45);
            });
        });
        
        describe('Test7-Percentages', function() {
            it('Parse to 1.2345', function() {
                var options = new nf.parseNumberSimpleOptions()
                    .specifyAll('.', ',', false, false, true)
                    .specifyPerc(true);
                var number = nf.parseNumberSimple('123.45%', options, true);
                assert.equal(number, 1.2345);
                
                number = nf.parseNumberSimple('-1.45%', options, true);
                assert.equal(number, -0.0145);
                
                number = nf.parseNumberSimple('-.12%', options, true);
                assert.equal(number, -0.0012);
                
                number = nf.parseNumberSimple('-1%', options, true);
                assert.equal(number, -0.01);
            });
        });
    });
    
    describe('Negative Tests', function() {
        describe('Test1-Strict', function() {
            it('Parse to 1', function() {
                try {
                    var options = new nf.parseNumberSimpleOptions().specifyAll(' ', ',', true);
                    var number = nf.parseNumberSimple('1 0 0', options, true);
                    assert.fail('Error expected');
                } catch(err) {
                    assert.equal(err.name, 'Error');
                    assert.equal(err.message, 'Input has more than 1 decimal point: 2');
                }
            });
        });
        
        describe('Test2-ParseNegative', function() {
            it('Parse to 1', function() {
                var options = new nf.parseNumberSimpleOptions().specifyAll('.', ',', false, false, false);
                var number;
                try {
                    number = nf.parseNumberSimple('(1,000,123.45)', options, true);
                    assert.fail();
                } catch(err) {
                    assert.equal(err.name, 'NaNError');
                }
                
                // now try with more strict options
                options = new nf.parseNumberSimpleOptions().specifyAll('.', ',', true, true, false);
                try {
                    number = nf.parseNumberSimple('(1,000,123.45)', options, true);
                    assert.fail();
                } catch(err) {
                    assert.equal(err.name, 'Error');
                }
                
                options = new nf.parseNumberSimpleOptions().specifyAll('.', ',', true, true, true);
                number = nf.parseNumberSimple('(1,000,123.45)', options, true);
                assert.equal(number, 1000123.45);
            });
        });
    });
});


describe('formatNumber', function() {
    describe('Positive Tests', function() {
        
        describe('Test1', function() {
            it('Format to 1.23', function() {
                var options = new nf.formatNumberOptions();
                var numberStr = nf.formatNumber(1, options, true);
                assert.equal(numberStr, '1');
            });
        });
        
        describe('Test2', function() {
            it('Format to 1,234.56', function() {
                var options = new nf.formatNumberOptions();
                var numberStr = nf.formatNumber(1234.56, options, true);
                assert.equal(numberStr, '1,234.56');
            });
        });
        
        describe('Test3', function() {
            it('Format to 1,234,567.89', function() {
                var options = new nf.formatNumberOptions();
                var numberStr = nf.formatNumber(1234567.89, options, true);
                assert.equal(numberStr, '1,234,567.89');
            });
        });
        
        describe('Test4', function() {
            it('Format to 1.00', function() {
                var options = new nf.formatNumberOptions();
                options.decimalMaskStr = '00';
                var numberStr = nf.formatNumber(1, options, true);
                assert.equal(numberStr, '1.00');
            });
        });
        
        describe('Test5', function() {
            it('Format to 0,123.00', function() {
                var options = new nf.formatNumberOptions();
                options.decimalMaskStr = '00';
                options.groupMaskStr = '0,000';
                var numberStr = nf.formatNumber(123, options, true);
                assert.equal(numberStr, '0,123.00');
            });
        });
    });
});