/**
 * highlight.js Solidity syntax highlighting definition
 *
 * @see https://github.com/isagalaev/highlight.js
 *
 * @package: highlightjs-solidity
 * @author:  Sam Pospischil <sam@changegiving.com>
 * @since:   2016-07-01
 */

const { SOL_ASSEMBLY_KEYWORDS, baseAssembly } = require("../common.js");

function hljsDefineYul(hljs) {

    var YUL_KEYWORDS = {
        keyword: SOL_ASSEMBLY_KEYWORDS.keyword + ' ' +
            'object code data',
        built_in: SOL_ASSEMBLY_KEYWORDS.built_in + ' ' +
            'datasize dataoffset datacopy ' +
            'setimmutable loadimmutable ' +
            'linkersymbol memoryguard',
        literal: SOL_ASSEMBLY_KEYWORDS.literal
    };

    return hljs.inherit(
        baseAssembly(hljs),
        { keywords: YUL_KEYWORDS }
    );
}

module.exports = hljsDefineYul;
