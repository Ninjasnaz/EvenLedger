# EvenLedger architecture and project plan

Updated October 21, 2026.
Status: Local app implemented and checked. Phase 5 readiness check found that Sites is not enabled for the currently selected workspace. Publishing is blocked by availability; no deployment has been attempted.

## Purpose and intended user

EvenLedger is a tip and bill splitter for someone dividing a shared restaurant bill. Enter a bill, choose a tip, and see the total and each person's share.

The learning goal is to understand planning, architecture, HTML, CSS, JavaScript, debugging, testing, Git, and publishing by building a small working app in phases.

All project source and documentation belong in this folder. Build and inspect locally before publishing.

## Confirmed direction

- Name: EvenLedger.
- A clean, prestigious financial appearance, inspired by a bank website.
- Deep navy backgrounds and cards, silver controls and accents, and cool white text.
- Restaurant-themed imagery and subtle animation, with a Pause/Play control.
- An uncluttered interface with a clear calculator and readable results.
- Equal splitting in US dollars for the first version.
- Allocate leftover cents across shares so the shares add up exactly to the total.
- Calculate when the visitor submits the form using the Calculate button or Enter.
- Intended publishing destination: ChatGPT Sites, confirmed by the learner.

## First-version plan

- Bill amount input in USD, starting at 0.
- An always-editable tip percentage field, with nearby shortcut buttons for 15%, 18%, 20%, and 22%. The buttons fill the same field; the visitor can type a different percentage, including 0% or values above 100%.
- An always-editable whole-number people field, starting at 2, with nearby shortcut buttons for 2, 3, 4, 5, and 8. Other positive whole numbers can be entered directly.
- Confirmed: A Calculate button, with results refreshed when the form is submitted. Support Enter as well as clicking the button. Implementation choice: clear previous results when an input changes and show a prompt to calculate again.
- Results for the tip amount, total including tip, and shares.
- Clear feedback for missing or invalid values. Require a positive bill, a nonnegative tip, and a whole-number count of at least one person.
- A Reset action.
- Phone and desktop layouts, visible keyboard focus, labeled inputs, and readable contrast.

The bill starting at 0, tip starting at 15%, people starting at 2, editable fields, and shortcut values were specified by the learner.

## Input rules and defaults

| Input | Initial value | Accepted values |
| --- | --- | --- |
| Bill | 0 | $0.01 through $99,999.99 to calculate, with at most two decimal places. Initial 0 is an idle value. |
| Tip | 15%, editable | Any nonnegative percentage, with at most two decimal places; shortcuts for 15%, 18%, 20%, and 22%. |
| People | 2 | Any positive whole number; shortcuts for 2, 3, 4, 5, and 8. |

Reset restores these initial values, including the learner's 15% starting tip, and clears results and errors. Display the initial bill as 0 without showing an error on load. Require a positive bill when Calculate is pressed. The tip remains editable.

When the bill field receives focus through clicking or keyboard navigation, clear its value if it is zero. Preserve nonzero amounts on refocus. Reset still restores the initial 0, which clears on its next focus. An untouched empty field continues to use the existing validation on Calculate.

Shortcut buttons are conveniences, not restrictions. Selecting one fills the adjacent input without submitting the form. Keep selected styling synchronized with the typed value; when it does not match a shortcut, no shortcut is selected. Clicking a shortcut or typing invalidates previous results in the same way.

Remove the earlier proposed 100% tip cap and 100-person cap. Reject values that cannot be processed with exact, safe integer arithmetic rather than silently losing precision. This technical validation does not restrict the fields to the shortcut values. The bill limit remains an implementation choice.

Accept ordinary decimal input, including a decimal point, rather than currency symbols, grouping commas, or exponent notation. Label units beside the fields. Never silently round an over-precise bill or truncate a fractional people count; ask the visitor to correct it.

## Calculation rules

For this version, the bill input is the amount to split before adding a tip. It can already include tax or fees; the app adds no separate tax. The entered tip percentage applies to the entire entered bill.

Convert the bill to whole cents. Calculate the tip and round it once to the nearest cent, with half-cent ties rounded up for nonnegative values. Add bill cents and tip cents to produce total cents.

Confirmed share-allocation rule: Divide total cents by the number of people. If there are leftover cents, assign one extra cent to that many shares. Display both share amounts and how many people pay each amount. Do not label a rounded average as an exact payment for everyone.

Examples verified by automated calculation tests and browser interaction on October 21, 2026:

| Bill | Tip | People | Expected tip | Expected total | Expected shares |
| --- | --- | --- | --- | --- | --- |
| $100.00 | 20% | 4 | $20.00 | $120.00 | 4 pay $30.00 |
| $10.00 | 0% | 3 | $0.00 | $10.00 | 1 pays $3.34; 2 pay $3.33 |
| $19.99 | 15% | 2 | $3.00 | $22.99 | 1 pays $11.50; 1 pays $11.49 |

Parse decimal text into integers rather than using floating-point arithmetic for money. Represent the bill as cents and the tip percentage as hundredths of a percentage point. This makes the rounding rule explicit. Tests must cover rounding and ensure that all shares sum to the total.

Implementation: `calculateSplit` accepts the three input strings and returns either field errors or calculated integer amounts and share groups. Guard the bill-times-tip intermediate product with `Number.isSafeInteger`. Round the tip using integer quotient/remainder, then allocate remaining cents. Group shares by count instead of creating a list entry per person.

Display money by formatting the whole dollars and remaining cents separately. An uneven split is labeled BASE SHARE, with both exact payment groups listed below; an even split is labeled PER PERSON. Editing any field or choosing a shortcut clears the previous results. Validation runs on form submission, identifies fields with `aria-invalid` and associated messages, and focuses the first invalid field. Result updates are announced through a polite live region. A zero initial bill does not show an error until submission.

## Architecture and data flow

Architecture means the major parts of the app, their responsibilities, and how they communicate. For EvenLedger, use a static web app: the hosting service delivers files and the visitor's browser runs the calculator. Static describes file delivery; the page can still respond to input.

```text
Bill, tip, and people entered in the form
                  |
                  v
Read and validate input in JavaScript
                  |
           valid / invalid
             /         \
Calculate in cents    Show a useful error
          |
          v
Display tip, total, and exact shares
```

Keep calculation functions separate from code that reads and updates the page. This allows calculation tests without opening a browser and makes bugs easier to locate.

The first version needs no application backend, database, user accounts, external API, or persistent bill history. Inputs live in the current page and reset on reload. The host still serves files; that is different from adding a server that processes bills.

## Language and tooling

| Part | Choice | What it does and why it fits |
| --- | --- | --- |
| Page structure | HTML | Defines labeled inputs, buttons, and result regions. |
| Appearance | CSS | Defines the dark palette, typography, spacing, and responsive layout. |
| Behavior | JavaScript | Validates input, calculates money, and updates the page. |
| Local preview | Python's built-in HTTP server | From this folder, use `python3 -m http.server 5180 --bind 127.0.0.1` and inspect `http://127.0.0.1:5180/`. Check port availability during setup. |
| Calculation tests | Node's built-in test runner | Use `node --test calculator.test.mjs`. Checks meaningful numeric behavior without adding a test framework. Node is development tooling, not a visitor requirement. |
| Change history | Git | Records changes and lets us inspect or restore earlier work. |
| Repository sharing | GitHub, later in the learning sequence | Stores a remote copy and lets us practice a branch and pull request. |
| Publishing | ChatGPT Sites, subject to compatibility and account checks | Intended hosted destination after local verification. |

Apply YAGNI: add dependencies only for a concrete need. A framework or bundler is not required by the calculator itself. Hosting may require a small adapter or build setup; verify before choosing it.

Verified locally October 21, 2026: Node v24.13.0, npm 11.6.2, Python 3.9.6, and Git 2.56.0. npm is available but not needed for the initial dependency-free setup. Initialized a separate Git repository on branch `main` in this folder after confirming there was no enclosing repository. Author settings are project-local and were supplied by the learner.

Source organization:

- `index.html`: the page structure and accessible form.
- `styles.css`: the design and responsive layout.
- `app.js`: connects form submission, shortcuts, reset, bill focus, error feedback, currency formatting, result rendering, and the image animation's Pause/Play control.
- `assets/restaurant-evening.png`: project-local restaurant photograph generated with the built-in image tool. `assets/README.md` records the generation prompt.
- `calculator.mjs`: validation and calculation functions independent of the page.
- `calculator.test.mjs`: 33 automated tests for examples, invalid input, rounding, numeric boundaries, and share invariants.

The `.mjs` extension explicitly identifies a JavaScript module, which lets Node load exports and imports without extra package configuration. The browser imports it too. `README.md` contains run/test commands and manual interface checks. Keep these two planning files as the working record.

## Visual direction

Use navy surfaces, cool white text, silver buttons, and blue borders. Remove the old gold, olive, and brown palette. Establish hierarchy through spacing, typography, and aligned amounts. The introduction pairs dining-oriented copy with restaurant photography on wide screens. It stacks above the calculator on narrow screens. The summary sits beside the form on wide screens and below it on narrow screens. Use system and local fonts.

The generated restaurant image is stored inside the project and loaded as a normal image, with descriptive alternative text. CSS slowly pans/zooms it; a labeled button pauses and resumes the animation. The motion preference media rule disables animations/transitions and hides the motion toggle when reduced motion is requested. Narrow screens use a compact icon button so the image caption stays clear. No animation framework or external image service is needed at runtime.

Version query strings on the stylesheet and script URLs make the redesigned assets distinct from the previous cached versions. Refresh after changes; increment the relevant asset version when needed. Narrow layouts can be checked in the laptop browser by setting its viewport; this is not a test on physical mobile hardware.

Do not add decorative financial charts, market tickers, fake account balances, or navigation for nonexistent pages. Review the actual served page before treating the design as finished.

## Later possibilities

Revisit separate tax handling, uneven shares, multiple currencies, saved preferences, and a shareable summary only after the first version works and there is a reason to add them. These are ideas, not commitments.

## Completion criteria

- A visitor can calculate a bill, change values, correct an error, and reset.
- Worked examples, zero tip, currency rounding, and remainder distribution are checked.
- Missing input, negative amounts, zero people, and fractional people produce useful feedback.
- The served page is inspected on desktop and a narrow viewport, including keyboard use.
- The learner can explain input -> validation -> calculation -> display and locate the corresponding code.
- Run and test instructions work, progress is recorded, and working changes are saved in Git.
- The publishing phase is complete only after a successful deployment and checks at the actual hosted URL.

## Hosting evidence and unresolved details

Checked October 21, 2026: [OpenAI's Create a site documentation](https://learn.chatgpt.com/docs/sites/creating-a-site) describes starting from a compatible local project. [Manage a site](https://learn.chatgpt.com/docs/sites/managing-a-site) documents the local linkage in `.openai/hosting.json` and separates saving a version from deploying it.

Live availability check: The read-only Sites listing returned `SitesConnectorError: Sites is not yet enabled for this workspace.`, with `sites_access_disabled`. The connector's current workspace cannot proceed with Sites. This is a service-availability result, not an application-code failure, and it does not identify whether the cause is account rollout or workspace administration.

Source inspection: The app consists of static HTML, CSS, JavaScript modules, and a local PNG. All stylesheet/script/image/import paths resolve locally; the runtime source has no localhost endpoints, application backend, database, or API-key requirement. The Git tree was clean at checked commit `78675e7`. No `.openai/hosting.json` or Git remote exists yet. This supports a static-hosting assessment, but does not certify the exact Sites packaging contract.

Destination confirmed: ChatGPT Sites. Unresolved after availability is restored: exact packaging/configuration requirements, backend compatibility validation, any costs, and intended audience. No remote site, hosting configuration, pushed source, saved hosted version, or deployment has been created. Keep existing source unchanged until the learner approves any required packaging change.

## Decision history

- October 21, 2026: Learner selected EvenLedger, a dark charcoal/ivory/gold style, and equal splitting in USD.
- October 21, 2026: Proposed a browser-only calculator with HTML, CSS, and JavaScript.
- October 21, 2026: Learner confirmed the exact-cent share-allocation rule so displayed shares sum to the total, and clarified that ChatGPT Sites is the intended publishing destination.
- October 21, 2026: Learner chose the Calculate button. Use form submission so Enter works too; clear outdated results on input changes to avoid displaying stale amounts.
- October 21, 2026: Selected dependency-free HTML, CSS, and JavaScript for direct learning and the app's small scope. Selected Python's built-in local server and Node's built-in tests after checking installed versions. Use `.mjs` for calculation/test modules to avoid package setup solely for module configuration. Set explicit input limits and defaults to make validation testable.
- October 21, 2026: Learner specified a bill starting at 0, an editable tip field with 15/18/20/22% shortcuts, and an editable people field starting at 2 with 2/3/4/5/8 shortcuts. Removed proposed tip and people product caps to permit custom entries. Shortcuts fill inputs without calculating; the Calculate button remains the submission action.
- October 21, 2026: Implemented the interface with working shortcuts/reset and an explicitly disabled Calculate action for this phase. Browser checks caught Reset highlights updating before native reset completed; deferred synchronization until after reset. Served and inspected at `http://127.0.0.1:5180/` in Edge, including a 375px phone viewport.
- October 21, 2026: Connected Calculate/Enter to a pure calculation module, inline validation, and exact-share rendering. Kept the chosen architecture and added no dependencies. Used a two-row allocation for uneven shares and cleared outdated results on edits. Verified worked examples and recovery in Edge, including mobile layout and large custom entries, and added focused Node tests.
- October 21, 2026: Learner requested only the bill-focus change before further phase work: clear a zero bill on focus, preserve entered nonzero amounts, and retain Reset's initial 0.
- October 21, 2026: Learner authorized a broader visual update: 15% default tip, navy and silver, and restaurant-themed images or animation. Replaced the old palette, added a generated restaurant photograph with CSS animation and Pause/Play, and increased supporting text sizes. Kept the calculation module unchanged. Added versioned asset URLs after the browser reused old CSS, and used laptop browser viewports to check narrow layouts.

Update this file when scope, calculation rules, components, tooling, storage, or hosting decisions change. Record the reason. Routine task progress belongs in `phases.md`.
