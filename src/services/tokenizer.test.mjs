import assert from 'node:assert/strict';

function calculateOrpIndex(word) {
  const cleanLength = word.replace(/[^a-zA-Z0-9]/g, '').length || word.length;
  if (cleanLength <= 1) return 0;
  if (cleanLength <= 5) return 1;
  if (cleanLength <= 9) return 2;
  if (cleanLength <= 13) return 3;
  return 4;
}

assert.equal(calculateOrpIndex('I'), 0);
assert.equal(calculateOrpIndex('code'), 1);
assert.equal(calculateOrpIndex('pipeline'), 2);
assert.equal(calculateOrpIndex('deterministic'), 3);
assert.equal(calculateOrpIndex('synchronization'), 4);
console.log('ORP Tokenizer unit tests passed.');
