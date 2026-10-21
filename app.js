import { calculateSplit } from './calculator.mjs';

const form = document.querySelector('#split-form');
const billInput = form.elements.namedItem('bill');
const shortcuts = [...document.querySelectorAll('[data-field]')];
const fieldNames = ['bill', 'tip', 'people'];
const formMessage = document.querySelector('#form-message');
const shareLabel = document.querySelector('#share-label');
const shareAmount = document.querySelector('#share-amount');
const shareDollars = document.querySelector('#share-dollars');
const shareCents = document.querySelector('#share-cents');
const shareExplanation = document.querySelector('#share-explanation');
const allocation = document.querySelector('#share-allocation');

function moneyParts(cents) {
  return {
    dollars: Math.floor(cents / 100).toLocaleString('en-US'),
    fraction: String(cents % 100).padStart(2, '0'),
  };
}

function formatMoney(cents) {
  const { dollars, fraction } = moneyParts(cents);
  return `$${dollars}.${fraction}`;
}

function showShare(cents) {
  const { dollars, fraction } = moneyParts(cents);
  shareDollars.textContent = dollars;
  shareCents.textContent = `.${fraction}`;
  shareAmount.classList.toggle('is-long', dollars.length > 4);
  shareAmount.classList.toggle('is-very-long', dollars.length > 9);
}

function clearErrors() {
  for (const name of fieldNames) {
    form.elements.namedItem(name).removeAttribute('aria-invalid');
    const message = document.querySelector(`#${name}-error`);
    message.hidden = true;
    message.textContent = '';
  }
}

function clearResults(message) {
  showShare(0);
  shareLabel.textContent = 'PER PERSON';
  shareExplanation.textContent = 'Your split will appear here after you calculate.';
  allocation.replaceChildren();
  allocation.hidden = true;
  for (const name of ['bill', 'tip', 'total']) {
    document.querySelector(`#${name}-result`).textContent = '$0.00';
  }
  formMessage.textContent = message;
}

function showResult(result) {
  showShare(result.baseShareCents);
  document.querySelector('#bill-result').textContent = formatMoney(result.billCents);
  document.querySelector('#tip-result').textContent = formatMoney(result.tipCents);
  document.querySelector('#total-result').textContent = formatMoney(result.totalCents);
  const uneven = result.shares.length > 1;
  shareLabel.textContent = uneven ? 'BASE SHARE' : 'PER PERSON';
  shareExplanation.textContent = uneven
    ? 'Shares differ by one cent. Here is the exact split.'
    : `${result.people.toLocaleString('en-US')} ${result.people === 1 ? 'person pays' : 'people pay'} ${formatMoney(result.baseShareCents)}${result.people === 1 ? '.' : ' each.'}`;

  allocation.replaceChildren();
  allocation.hidden = !uneven;
  if (uneven) {
    for (const share of result.shares) {
      const row = document.createElement('li');
      const count = document.createElement('span');
      count.textContent = `${share.count.toLocaleString('en-US')} ${share.count === 1 ? 'person pays' : 'people pay'}`;
      const amount = document.createElement('strong');
      amount.textContent = formatMoney(share.cents);
      row.append(count, amount);
      allocation.append(row);
    }
  }
  formMessage.textContent = 'Split calculated. Every share adds up to the total.';
}

function syncShortcuts() {
  for (const button of shortcuts) {
    const input = form.elements.namedItem(button.dataset.field);
    const selected = input.value.trim() !== ''
      && Number(input.value) === Number(button.dataset.value);
    button.setAttribute('aria-pressed', String(selected));
  }
}

function handleEdit() {
  syncShortcuts();
  clearErrors();
  clearResults('Values changed. Calculate to see your split.');
}

for (const button of shortcuts) {
  button.addEventListener('click', () => {
    const input = form.elements.namedItem(button.dataset.field);
    input.value = button.dataset.value;
    handleEdit();
  });
}

billInput.addEventListener('focus', () => {
  if (billInput.valueAsNumber === 0) billInput.value = '';
});

form.addEventListener('input', handleEdit);
form.addEventListener('reset', () => {
  clearErrors();
  clearResults('Ready for a new bill.');
  // The reset event fires before the browser restores the initial values.
  setTimeout(syncShortcuts, 0);
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();
  const result = calculateSplit({
    bill: form.elements.namedItem('bill').value,
    tip: form.elements.namedItem('tip').value,
    people: form.elements.namedItem('people').value,
  });

  if (!result.ok) {
    clearResults('Check the highlighted fields, then calculate again.');
    for (const [name, message] of Object.entries(result.errors)) {
      const input = form.elements.namedItem(name);
      input.setAttribute('aria-invalid', 'true');
      const error = document.querySelector(`#${name}-error`);
      error.textContent = message;
      error.hidden = false;
    }
    form.elements.namedItem(Object.keys(result.errors)[0]).focus();
    return;
  }
  showResult(result);
});

syncShortcuts();
form.querySelector('[type="submit"]').disabled = false;

const motionToggle = document.querySelector('#motion-toggle');
motionToggle.addEventListener('click', () => {
  const paused = document.body.classList.toggle('motion-paused');
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.setAttribute('aria-label', paused ? 'Play restaurant animation' : 'Pause restaurant animation');
  document.querySelector('#motion-label').textContent = paused ? 'Play motion' : 'Pause motion';
});
