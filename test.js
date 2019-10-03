const assert = require('assert');
const parse5 = require('parse5');

const hljs = require('highlightjs');
const defineSolidity = require('.');

defineSolidity(hljs);

// Receives a Solidity snippet and returns an array of [type, text] tuples.
// Type is the detected token type, and text the corresponding source text.
function getTokens(source) {
  const { value } = hljs.highlight('solidity', source);
  const frag = parse5.parseFragment(value);

  return frag.childNodes.map(function (node) {
    if (node.nodeName === '#text') {
      return ['none', node.value];
    } else {
      const type = node.attrs.find(a => a.name === 'class').value.replace(/^hljs-/, '');
      assert(
        node.childNodes.length === 1 && node.childNodes[0].nodeName === '#text',
        'Unexpected nested tags',
      );
      return [type, node.childNodes[0].value];
    }
  });
}

// Taken from the Solidity repo.
it('numbers', function () {
  const ok = [
    '-1',
    '654_321',
    '54_321',
    '4_321',
    '5_43_21',
    '1_2e10',
    '12e1_0',
    '3.14_15',
    '3_1.4_15',
    '0x8765_4321',
    '0x765_4321',
    '0x65_4321',
    '0x5_4321',
    '0x123_1234_1234_1234',
    '0x123456_1234_1234',
    '0X123',
    '0xffffff',
    '0xfff_fff',
  ];

  const fail = [
    '1234_',
    '12__34',
    '12_e34',
    '12e_34',
    '3.1415_',
    '3__1.4__15',
    '3__1.4__15',
    '1._2',
    '1.2e_12',
    '1._',
    '0x1234__1234__1234__123',
  ];

  for (const n of ok) {
    assert.deepEqual(getTokens(n), [['number', n]]);
  }

  for (const n of fail) {
    assert.notDeepEqual(getTokens(n), [['number', n]]);
  }
});

it('identifier with dollar sign and digit', function () {
  assert.deepEqual(getTokens('id$1'), [['none', 'id$1']]);
});
