/**
 * highlight.js Solidity syntax highlighting definition
 *
 * @see https://github.com/isagalaev/highlight.js
 *
 * :TODO:
 * - assembly block keywords
 *
 * @package: highlightjs-solidity
 * @author:  Sam Pospischil <sam@changegiving.com>
 * @since:   2016-07-01
 */

var module = module ? module : {};     // shim for browser use

function hljsDefineSolidity(hljs) {

    //first: let's set up all parameterized types (bytes, int, uint, fixed, ufixed)
    //NOTE: I'm *not* including the unparameterized versions here, those are included
    //manually
    var byteSizes = [];
    for(var i = 0; i < 32; i++) {
        byteSizes[i] = i+1;
    }
    var numSizes = byteSizes.map(function(bytes) { return bytes * 8 } );
    var precisions = [];
    for(i = 0; i <= 80; i++) {
        precisions[i] = i;
    }

    var bytesTypes = byteSizes.map(function(size) { return 'bytes' + size });
    var bytesTypesString = bytesTypes.join(' ') + ' ';

    var uintTypes = numSizes.map(function(size) { return 'uint' + size });
    var uintTypesString = uintTypes.join(' ') + ' ';

    var intTypes = numSizes.map(function(size) { return 'int' + size });
    var intTypesString = intTypes.join(' ') + ' ';

    var sizePrecisionPairs = [].concat.apply([],
        numSizes.map(function(size) {
            return precisions.map(function(precision) {
                return size + 'x' + precision;
            })
        })
    );

    var fixedTypes = sizePrecisionPairs.map(function(pair) { return 'fixed' + pair });
    var fixedTypesString = fixedTypes.join(' ') + ' ';

    var ufixedTypes = sizePrecisionPairs.map(function(pair) { return 'ufixed' + pair });
    var ufixedTypesString = ufixedTypes.join(' ') + ' ';

    var SOL_KEYWORDS = {
        keyword:
            'var bool string ' +
            'int uint ' + intTypesString + uintTypesString +
            'byte bytes ' + bytesTypesString +
            'fixed ufixed ' + fixedTypesString + ufixedTypesString +
            'enum struct mapping address ' +

            'new delete ' +
            'if else for while continue break return throw emit ' +
            //NOTE: doesn't always act as a keyword, but I think it's fine to include
            '_ ' +

            'function modifier event constructor ' +
            'constant anonymous indexed ' +
            'storage memory calldata ' +
            'external public internal payable pure view private returns ' +

            'import using pragma ' +
            'contract interface library ' +
            'assembly',
        literal:
            'true false ' +
            'wei szabo finney ether ' +
            'seconds minutes hours days weeks years',
        built_in:
            'self ' +   // :NOTE: not a real keyword, but a convention used in storage manipulation libraries
            'this super selfdestruct suicide ' +
            'now ' +
            'msg block tx abi ' +
            'type ' +
            'blockhash gasleft ' +
            'assert revert require ' +
            'sha3 sha256 keccak256 ripemd160 ecrecover addmod mulmod ' +
            'log0 log1 log2 log3 log4' +
            // :NOTE: not really toplevel, but advantageous to have highlighted as if reserved to
            //        avoid newcomers making mistakes due to accidental name collisions.
            'send transfer call callcode delegatecall staticcall ',
    };

    //like a C number, except:
    //1. no octal literals (leading zeroes disallowed)
    //2. underscores (1 apiece) are allowed between consecutive digits
    //(including hex digits)
    //also, I've replaced all instances of \b (word boundary)
    //with (?<![A-Za-z0-9_$])
    var SOL_NUMBER_RE = /-?((?<![A-Za-z0-9_$])0[xX]([a-fA-F0-9]_?)*[a-fA-F0-9]|((?<![A-Za-z0-9_$])[1-9](_?\d)*(\.((\d_?)*\d)?)?|\.\d(_?\d)*)([eE][-+]?\d(_?\d)*)?|(?<![A-Za-z0-9_$])0)/;

    var SOL_NUMBER = {
        className: 'number',
        begin: SOL_NUMBER_RE,
        relevance: 0,
    };

    var SOL_FUNC_PARAMS = {
        className: 'params',
        begin: /\(/, end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: SOL_KEYWORDS,
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            SOL_NUMBER,
            'self' //to account for mappings and fn variables
        ]
    };

    var HEX_APOS_STRING_MODE = {
      className: 'string',
      begin: /hex'[0-9a-fA-F]*'/,
    };
    var HEX_QUOTE_STRING_MODE = {
      className: 'string',
      begin: /hex"[0-9a-fA-F]*"/,
    };

    //NOTE: including "*" as a "lexeme" because we use it as a "keyword" below
    var SOL_LEXEMES_RE = /[A-Za-z_$][A-Za-z_$0-9]*|\*/;

    var SOL_RESERVED_MEMBERS = {
        begin: /\.\s*/,  // match any property access up to start of prop
        end: /[^A-Za-z0-9$_\.]/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: {
            built_in: 'gas value send transfer call callcode delegatecall staticcall balance length push pop name creationCode runtimeCode',
        },
        relevance: 2,
    };

    var SOL_TITLE_MODE =
        hljs.inherit(hljs.TITLE_MODE, {
            begin: /[A-Za-z$_][0-9A-Za-z$_]*/,
            lexemes: SOL_LEXEMES_RE,
            keywords: SOL_KEYWORDS,
        });

    function makeBuiltinProps(obj, props) {
        return {
            begin: "(?<![A-Za-z0-9_$])" + obj + '\\.\\s*',
            end: /[^A-Za-z0-9$_\.]/,
            excludeBegin: false,
            excludeEnd: true,
            lexemes: SOL_LEXEMES_RE,
            keywords: {
                built_in: obj + ' ' + props,
            },
            contains: [
                SOL_RESERVED_MEMBERS
            ],
            relevance: 10,
        };
    }

    return {
        aliases: ['sol'],
        keywords: SOL_KEYWORDS,
        lexemes: SOL_LEXEMES_RE,
        contains: [
            // basic literal definitions
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            HEX_APOS_STRING_MODE,
            HEX_QUOTE_STRING_MODE,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            SOL_NUMBER,
            { // functions
                className: 'function',
                lexemes: SOL_LEXEMES_RE,
                beginKeywords: 'function modifier event constructor', end: /[{;]/, excludeEnd: true,
                contains: [
                    SOL_TITLE_MODE,
                    SOL_FUNC_PARAMS,
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE
                ],
                illegal: /%/,
            },
            // built-in members
            makeBuiltinProps('msg', 'gas value data sender sig'),
            makeBuiltinProps('block', 'blockhash coinbase difficulty gaslimit number timestamp '),
            makeBuiltinProps('tx', 'gasprice origin'),
            makeBuiltinProps('abi', 'decode encode encodePacked encodeWithSelector encodeWithSignature'),
            SOL_RESERVED_MEMBERS,
            { // contracts & libraries & interfaces
                className: 'class',
                lexemes: SOL_LEXEMES_RE,
                beginKeywords: 'contract interface library', end: '{', excludeEnd: true,
                illegal: /[:"\[\]]/,
                contains: [
                    { beginKeywords: 'is', lexemes: SOL_LEXEMES_RE },
                    SOL_TITLE_MODE,
                    SOL_FUNC_PARAMS,
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE
                ]
            },
            { // structs & enums
                lexemes: SOL_LEXEMES_RE,
                beginKeywords: 'struct enum', end: '{', excludeEnd: true,
                illegal: /[:"\[\]]/,
                contains: [
                    SOL_TITLE_MODE,
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE
                ]
            },
            { // imports
                beginKeywords: 'import', end: ';|$',
                lexemes: SOL_LEXEMES_RE,
                keywords: 'import * from as',
                contains: [
                    SOL_TITLE_MODE,
                    hljs.APOS_STRING_MODE,
                    hljs.QUOTE_STRING_MODE,
                    HEX_APOS_STRING_MODE,
                    HEX_QUOTE_STRING_MODE,
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE
                ]
            },
            { // using
                beginKeywords: 'using', end: ';|$',
                lexemes: SOL_LEXEMES_RE,
                keywords: 'using * for',
                contains: [
                    SOL_TITLE_MODE,
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE
                ]
            },
            { // pragmas
                beginKeywords: 'pragma', end: ';|$',
                lexemes: SOL_LEXEMES_RE,
                keywords: {
                    keyword: 'pragma solidity experimental',
                    built_in: 'ABIEncoderV2 SMTChecker'
                },
                contains: [
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE
                ]
            }
        ],
        illegal: /#/
    };
}

module.exports = function(hljs) {
    hljs.registerLanguage('solidity', hljsDefineSolidity);
};

module.exports.definer = hljsDefineSolidity;
