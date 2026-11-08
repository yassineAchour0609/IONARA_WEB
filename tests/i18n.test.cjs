const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const dictionaries = require('../frontend/src/i18n/messages.json');
test('all three languages have complete nonempty dictionaries', () => {
  const keys = Object.keys(dictionaries.fr).sort();
  for (const locale of ['fr', 'en', 'ar']) {
    assert.deepEqual(Object.keys(dictionaries[locale]).sort(), keys);
    for (const value of Object.values(dictionaries[locale])) assert.ok(typeof value === 'string' && value.trim());
  }
});
test('active source has no Algerian currency or payment details', () => {
  function scan(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) scan(filename);
      else if (/\.(tsx?|json)$/.test(entry.name)) assert.doesNotMatch(fs.readFileSync(filename, 'utf8'), /DZD|BaridiMob|Algérie|Algeria|\+213/);
    }
  }
  scan(path.resolve(__dirname, '../frontend/src'));
  scan(path.resolve(__dirname, '../shared'));
});
