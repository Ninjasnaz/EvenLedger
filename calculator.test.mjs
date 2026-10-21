import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSplit } from './calculator.mjs';

const examples = [
  { name: '100 bill, 20% tip, four people', bill: '100', tip: '20', people: '4', tipCents: 2000, totalCents: 12000, shares: [{ count: 4, cents: 3000 }] },
  { name: '10 split three ways assigns the leftover cent', bill: '10', tip: '0', people: '3', tipCents: 0, totalCents: 1000, shares: [{ count: 1, cents: 334 }, { count: 2, cents: 333 }] },
  { name: '19.99 with a 15% tip rounds the tip once', bill: '19.99', tip: '15', people: '2', tipCents: 300, totalCents: 2299, shares: [{ count: 1, cents: 1150 }, { count: 1, cents: 1149 }] },
  { name: 'a custom 17.5% tip', bill: '40', tip: '17.5', people: '2', tipCents: 700, totalCents: 4700, shares: [{ count: 2, cents: 2350 }] },
  { name: 'one person pays the entire total', bill: '42.50', tip: '18', people: '1', tipCents: 765, totalCents: 5015, shares: [{ count: 1, cents: 5015 }] },
  { name: 'half a cent rounds up', bill: '0.01', tip: '50', people: '1', tipCents: 1, totalCents: 2, shares: [{ count: 1, cents: 2 }] },
  { name: 'less than half a cent rounds down', bill: '0.01', tip: '49.99', people: '1', tipCents: 0, totalCents: 1, shares: [{ count: 1, cents: 1 }] },
  { name: 'a percentage above 100 is permitted', bill: '10', tip: '125', people: '2', tipCents: 1250, totalCents: 2250, shares: [{ count: 2, cents: 1125 }] },
  { name: 'more people than cents still preserves the total', bill: '.01', tip: '0', people: '8', tipCents: 0, totalCents: 1, shares: [{ count: 1, cents: 1 }, { count: 7, cents: 0 }] },
  { name: 'more than 100 people is permitted', bill: '101', tip: '0', people: '101', tipCents: 0, totalCents: 10100, shares: [{ count: 101, cents: 100 }] },
  { name: 'two decimal places in a custom percentage', bill: '100', tip: '18.25', people: '2', tipCents: 1825, totalCents: 11825, shares: [{ count: 1, cents: 5913 }, { count: 1, cents: 5912 }] },
  { name: 'decimal input without a leading zero', bill: '.50', tip: '.5', people: '1', tipCents: 0, totalCents: 50, shares: [{ count: 1, cents: 50 }] },
];

for (const example of examples) {
  test(example.name, () => {
    const result = calculateSplit(example);
    assert.equal(result.ok, true);
    assert.equal(result.tipCents, example.tipCents);
    assert.equal(result.totalCents, example.totalCents);
    assert.deepEqual(result.shares, example.shares);
  });
}

const invalid = [
  ['bill', '', 'a missing bill'], ['bill', '0', 'a zero bill'],
  ['bill', '-1', 'a negative bill'], ['bill', '1.001', 'an over-precise bill'],
  ['bill', '100000', 'a bill above the first-version limit'], ['bill', '1e2', 'exponent notation'],
  ['bill', '$10', 'a currency symbol'], ['bill', '1,000', 'grouping commas'],
  ['tip', '', 'a missing tip'], ['tip', '-2', 'a negative tip'],
  ['tip', '12.345', 'an over-precise tip'], ['tip', 'Infinity', 'an infinite tip'],
  ['tip', '9007199254740992', 'a tip outside safe integer precision'],
  ['tip', '900719925474', 'a tip product outside safe integer precision'],
  ['people', '', 'a missing people count'], ['people', '0', 'zero people'],
  ['people', '-1', 'negative people'], ['people', '2.5', 'fractional people'],
  ['people', '9007199254740992', 'a people count outside safe integer precision'],
];

for (const [field, value, name] of invalid) {
  test(`rejects ${name}`, () => {
    const result = calculateSplit({ bill: '10', tip: '18', people: '2', [field]: value });
    assert.equal(result.ok, false);
    assert.ok(result.errors[field]);
  });
}

test('reports all invalid fields together so the form can identify them', () => {
  const result = calculateSplit({ bill: '', tip: '-1', people: '0' });
  assert.equal(result.ok, false);
  assert.deepEqual(Object.keys(result.errors), ['bill', 'tip', 'people']);
});

test('varied bills, custom tips, and group sizes preserve every cent', () => {
  for (const cents of [1, 2, 10, 99, 101, 1999, 9_999_999]) {
    for (const hundredths of [0, 1500, 1750, 1825, 12500]) {
      for (const count of [1, 2, 3, 7, 8, 101, Number.MAX_SAFE_INTEGER]) {
        const bill = `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`;
        const tip = `${Math.floor(hundredths / 100)}.${String(hundredths % 100).padStart(2, '0')}`;
        const result = calculateSplit({ bill, tip, people: String(count) });
        assert.equal(result.ok, true);
        // BigInt provides an independent exact reference for the rounding check.
        const expectedTip = (BigInt(cents) * BigInt(hundredths) + 5000n) / 10000n;
        assert.equal(BigInt(result.tipCents), expectedTip);
        assert.equal(result.totalCents, cents + result.tipCents);
        assert.equal(result.shares.reduce((sum, share) => sum + share.count * share.cents, 0), result.totalCents);
        assert.equal(result.shares.reduce((sum, share) => sum + share.count, 0), count);
        assert.ok(result.shares.every(share => share.count > 0 && Number.isInteger(share.cents) && share.cents >= 0));
        assert.ok(Math.max(...result.shares.map(share => share.cents)) - Math.min(...result.shares.map(share => share.cents)) <= 1);
      }
    }
  }
});
