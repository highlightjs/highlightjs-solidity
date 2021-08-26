`highlight.js` syntax definition for Solidity.

For more about highlight.js, see https://highlightjs.org/

For more about Solidity, see http://docs.soliditylang.org/

### Usage

If you're using webpack / rollup / browserify / node, you can just do
   
```javascript
var hljs = require('highlightjs');
var hljsDefineSolidity = require('highlightjs-solidity');

hljsDefineSolidity(hljs);
hljs.initHighlightingOnLoad();
```

Doing this will define both `solidity` and `yul` languages.

If you want to use this in your webpage, this package uses highlight.js's CDN build system to build its Solidity and Yul grammars.

### Compatibility

This package is not currently compatible with highlight.js version 11.

### Advanced

This is a pretty simple package, the only thing you might want to do differently is name the languages something other than `solidity` or `yul`. If you want to do this, simply `import { solidity, yul } from 'highlightjs-solidity';` and do `hljs.registerLanguage('othername1', solidity);` and `hljs.registerLanguage('othername2', yul);`.

### About the author

Find me at http://pospi.spadgos.com

Tip me some ether? (; `0x52c04Bf91ebB58221A4ac65967e4CDa15a871eba`
