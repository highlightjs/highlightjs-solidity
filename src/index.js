/*
Language: Solidity
Requires: solidity.js, yul.js
Author: SEE AUTHOR
Contributors: SEE CONTRIBUTORS
Description: A statically-typed curly-braces programming language designed for developing smart contracts that run on Ethereum.
Website: https://docs.soliditylang.org/en/latest/grammar.html
*/


/**
 * highlight.js Solidity syntax highlighting definition
 *
 * @see https://github.com/isagalaev/highlight.js
 *
 * @package: highlightjs-solidity
 * @author:  Sam Pospischil <sam@changegiving.com>
 * @since:   2016-07-01
 */

const solidityGrammar = require("./languages/solidity");
const yulGrammar = require("./languages/yul");

module.exports = function(hljs) {
    hljs.registerLanguage('solidity', solidityGrammar);
    hljs.registerLanguage('yul', yulGrammar);
};

module.exports.solidity = solidityGrammar;
module.exports.yul = yulGrammar;
