# EvenLedger

A small tip and bill splitter, built as a beginner software-development learning project. The design uses navy and silver with restaurant photography and subtle motion.

## Current milestone

The local calculator works. Enter a bill, select or type a tip percentage, and select or type a number of people. Press Calculate or Enter to see the tip, total, and exact shares. Bill starts at 0, tip at an editable 15%, and people at 2. Nothing has been published.

The restaurant image slowly pans and zooms. Use its Pause/Play button to control it. CSS disables motion when the browser requests reduced motion. The generated image and its prompt are stored in `assets/`.

If the total does not divide evenly into cents, the summary shows a base share plus the exact number of people paying each amount. Editing inputs or choosing a shortcut clears the old results until Calculate is pressed again. Reset clears results/errors and restores defaults.

The bill must be $0.01 through $99,999.99. Tip can be any nonnegative percentage with up to two decimal places, subject to exact numeric limits; people must be a positive whole number within safe numeric limits. Zero tip is allowed. A zero bill is the initial idle state, not a calculable bill.

## Run locally

Requires Python 3. No package installation is needed.

From this project folder, run:

```sh
python3 -m http.server 5180 --bind 127.0.0.1
```

Open [EvenLedger locally](http://127.0.0.1:5180/). Keep the server running while using the page. Press Ctrl+C in its terminal to stop it. Reload the page after changing a source file. If port 5180 is in use, choose a different port and open the matching URL.

The server serves this folder's files for local development. It is not our production hosting configuration.

## Files

- `index.html` defines the page and form.
- `styles.css` defines its appearance and responsive layout. The colors are named variables near the top.
- `app.js` connects form submission, shortcuts, errors, results, and reset.
- `calculator.mjs` validates the input and calculates in whole cents, independently of the page.
- `calculator.test.mjs` checks calculation and validation behavior.
- `architecture.md` records scope, decisions, data flow, and calculation rules.
- `phases.md` records progress, actual verification, and the next step.

## Run the calculation tests

Requires a Node.js version with the built-in test runner; verified locally with Node v24.13.0. No test packages are needed.

```sh
node --test calculator.test.mjs
```

The test runner executes each example and compares actual results with expected results. Tests cover worked examples, half-cent rounding, custom values, invalid input, and exact share allocation. A passing calculation test does not check the browser interface; use the checks below as well.

## Check this milestone

1. Open the local URL and verify bill 0, tip 15, and people 2. Click or tab into the bill field: 0 should clear. Type 42.50, leave the field, and return: the entered amount should remain. After Reset, the restored 0 should clear on the next focus and the tip should return to 15%.
2. Select each tip shortcut: 15%, 18%, 20%, and 22%. Confirm the tip field follows it.
3. Enter 17.5 in the tip field. No tip shortcut should remain selected.
4. Select each people shortcut: 2, 3, 4, 5, and 8. Then type 6; no people shortcut should remain selected.
5. Reset. Confirm the initial values and matching selected shortcuts return.
6. Check that the inputs and buttons can be reached using Tab and that focus is visible.
7. Check a phone-sized viewport for usable controls and no horizontal overflow.

8. Enter a $100 bill, 20% tip, and 4 people. Calculate. Expect a $20 tip, $120 total, and $30 each.
9. Enter $19.99, 15%, and 2 people. Expect a $3 tip, $22.99 total, and shares of $11.50 and $11.49.
10. Enter $10, 0%, and 3 people. Expect one $3.34 share and two $3.33 shares.
11. Change an input after calculating. Confirm the previous result is cleared and the page asks you to calculate again.
12. Try a missing bill, a negative amount, 0 people, and 2.5 people. Confirm feedback identifies the relevant field. Correct it and calculate again without reloading.
13. Verify Enter submits the form. Reset should clear errors and the exact-share list as well as restoring defaults.

Current verification is recorded in `phases.md`. The app needs a learner review before the publishing phase.

You can check a phone-sized layout from a laptop by using browser developer tools and a narrow responsive viewport. That checks layout behavior without requiring a phone to connect to localhost; it does not replace device-specific testing.
