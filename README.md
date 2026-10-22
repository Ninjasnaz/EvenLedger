# EvenLedger

**Every share, settled.**

EvenLedger is a small web app for splitting a restaurant bill with friends. Instead of passing a phone around doing mental math, you enter the bill, pick a tip, say how many people are at the table, and get an exact share for everyone — to the cent.

You can try out the live site at https://ninjasnaz.github.io/EvenLedger.

The goal is simple: the bill shouldn't interrupt a good evening. Let the app handle the arithmetic so the table can get back to the conversation, the food, and the company.

## What it does

- **Enter the bill amount** — the total before tip, including tax and fees.
- **Leave a tip** — choose 15%, 18%, 20%, or 22%, or type any percentage you like.
- **Set the number of people** — use a shortcut or enter any group size.
- **See the split** — tip amount, total to share, and how much each person pays.

When the total doesn't divide evenly, EvenLedger shows the exact split instead of rounding silently. For a $48.88 total across three people, it shows that one person pays $16.30 and two pay $16.29 — every cent accounted for, and the shares always add up to the total.

Zero tip is fine, and any positive whole number of people works. Bills can range from $0.01 to $99,999.99.

## Run it locally

Everything is static — no installs, no build step, no server-side code. All you need is Python 3.

```sh
python3 -m http.server 5180 --bind 127.0.0.1
```

Then open [http://127.0.0.1:5180/](http://127.0.0.1:5180/). Keep the server running while you use the page, and reload after changing a source file.

## How it's built

The page is plain HTML, CSS, and JavaScript. The money math lives in its own module so it can be tested separately.

- `index.html` — the page and form
- `styles.css` — colors, type, and responsive layout
- `app.js` — connects the form to the calculation and renders the results
- `calculator.mjs` — input validation and calculations in whole cents
- `calculator.test.mjs` — tests covering rounding, uneven splits, and invalid input
- `assets/` — the restaurant photograph used on the page

Run the tests with:

```sh
node --test calculator.test.mjs
```

## A note on the design

Navy and silver, with a slowly drifting restaurant scene and a Pause control for people who prefer their pages still. All of it is handled with CSS, so it works without any image processing or animation library.
