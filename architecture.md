# EvenLedger architecture

## Overview

EvenLedger is a static, single-page web app. The hosting service delivers HTML, CSS, JavaScript, and one photograph; the visitor's browser does all of the work. There is no build step, no backend, no database, no accounts, and no external API. Inputs live in the page and reset on reload.

## How a split flows through the app

```text
Bill, tip, and people entered in the form
                  |
                  v
app.js reads the three values and calls calculateSplit()
                  |
           valid / invalid
             /         \
Calculate in cents    Show a field-level error
          |
          v
Render tip, total, and the exact share groups
```

`calculator.mjs` knows nothing about HTML. It accepts the three input strings and returns either a set of field errors or the calculated amounts. Keeping it separate means the money math can be tested in Node without a browser.

## Inputs and validation

| Input | Default | Accepted |
| --- | --- | --- |
| Bill | 0 (idle) | $0.01 through $99,999.99, at most two decimal places |
| Tip | 15% | Any nonnegative percentage, at most two decimal places |
| People | 2 | Any positive whole number that fits in a safe integer |

- Shortcut buttons (15/18/20/22% and 2/3/4/5/8 people) fill the adjacent field; they are conveniences, not limits. Selected styling stays in sync with the typed value.
- Decimal text is parsed into integers rather than being run through floating-point math.
- Over-precise or out-of-range values are rejected with a message rather than silently rounded or truncated.
- All errors are collected on submit, each invalid field gets `aria-invalid` and its own message, and focus moves to the first invalid field.
- The initial bill of 0 is an idle value and does not show an error until the form is submitted.
- Changing any input or picking a shortcut clears the previous result and asks the visitor to calculate again.
- Reset restores 0 / 15 / 2 and clears errors, results, and the share list.

## Money math

All amounts are integer cents.

1. Parse the bill into cents and the tip percentage into hundredths of a percentage point (18.25% becomes 1825).
2. Multiply bill cents by the tip hundredths, then round once to the nearest cent, with exact half-cent ties rounded up. The intermediate product is checked with `Number.isSafeInteger`.
3. `totalCents = billCents + tipCents`.
4. `baseShareCents = floor(totalCents / people)`; the remainder is the number of people who pay one extra cent.
5. Shares are grouped by amount (`count` + `cents`) instead of one list entry per person.

Because of that last step, an uneven split is shown honestly: a $48.88 total across three people displays "1 person pays $16.30" and "2 people pay $16.29" — never a rounded average presented as if everyone paid the same.

## Files

- `index.html` — page structure, form, and accessible result regions
- `styles.css` — palette, typography, responsive layout, and motion
- `app.js` — form handling, shortcuts, validation display, result rendering, and the motion toggle
- `calculator.mjs` — parsing, validation, and the calculation itself
- `calculator.test.mjs` — tests for examples, rounding, boundaries, and share invariants
- `assets/` — the restaurant photograph and its generation prompt

## Accessibility and motion

- Every input has a visible label, and all controls are reachable and operable by keyboard with a visible focus ring.
- Results are announced through a polite live region; shortcut state uses `aria-pressed`.
- The restaurant image pans and zooms slowly via CSS. A labeled button pauses and resumes it.
- `prefers-reduced-motion` disables animations and transitions and hides the motion control.
- A `<noscript>` message explains that JavaScript is required to calculate.

## Testing

The calculation tests use Node's built-in runner and need no packages:

```sh
node --test calculator.test.mjs
```

They cover worked examples, half-cent rounding, custom and zero tips, tips above 100%, large groups, more people than cents, invalid and over-precise input, safe-integer boundaries, and a randomized check that shares always sum exactly to the total.
