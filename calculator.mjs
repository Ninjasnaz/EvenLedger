// This module knows about numbers, not HTML. It can run in a browser or in Node.
function parseHundredths(value) {
  const text = String(value ?? '').trim();
  if (!/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(text)) return null;

  const [whole = '', fraction = ''] = text.split('.');
  const scaled = Number(`${whole || '0'}${fraction.padEnd(2, '0')}`);
  return Number.isSafeInteger(scaled) ? scaled : null;
}

export function calculateSplit({ bill, tip, people }) {
  const errors = {};
  const billCents = parseHundredths(bill);
  const tipHundredths = parseHundredths(tip);
  const peopleText = String(people ?? '').trim();
  const count = /^\d+$/.test(peopleText) ? Number(peopleText) : NaN;

  if (billCents === null || billCents < 1 || billCents > 9_999_999) {
    errors.bill = 'Enter a bill from $0.01 to $99,999.99, using up to two decimal places.';
  }
  if (tipHundredths === null) {
    errors.tip = 'Enter a tip of 0% or more, using up to two decimal places.';
  }
  if (!Number.isInteger(count) || count < 1) {
    errors.people = 'Enter a whole number of people, at least 1.';
  } else if (!Number.isSafeInteger(count)) {
    errors.people = 'This group is too large. Enter a smaller whole number.';
  }
  if (Object.keys(errors).length) return { ok: false, errors };

  // 18.25% is 1,825 hundredths of a percent. Divide by 10,000 for the tip.
  const tipProduct = billCents * tipHundredths;
  if (!Number.isSafeInteger(tipProduct)) {
    return { ok: false, errors: { tip: 'This tip is too large to calculate exactly. Enter a smaller percentage.' } };
  }

  // Round once: 5,000 or more remaining ten-thousandths make another cent.
  const tipCents = Math.floor(tipProduct / 10_000) + (tipProduct % 10_000 >= 5_000 ? 1 : 0);
  const totalCents = billCents + tipCents;
  const baseShareCents = Math.floor(totalCents / count);
  const extraCentCount = totalCents % count;
  const shares = [];

  if (extraCentCount > 0) shares.push({ count: extraCentCount, cents: baseShareCents + 1 });
  if (count > extraCentCount) shares.push({ count: count - extraCentCount, cents: baseShareCents });

  return { ok: true, billCents, tipCents, totalCents, people: count, baseShareCents, shares };
}
