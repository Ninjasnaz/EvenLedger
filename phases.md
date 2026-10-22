# EvenLedger build phases

Updated October 21, 2026.
Current phase: 5 readiness check. Sites is not enabled for the selected workspace; no publication attempted.
This file records actual progress, checks, blockers, and the next task.

## Working agreement

Work on one selected project at a time. Explain the planning essentials and the reasons for architecture, language, and tooling choices at the beginning. Teach in small steps while building. Give occasional useful exercises, and ask about meaningful product or style choices before implementing them.

Keep this file current after meaningful work. Mark a check complete only when performed. Update `architecture.md` when a decision changes. Apply YAGNI throughout.

Before starting another change or phase, briefly describe the proposed work and wait for the learner's explicit go-ahead. An acknowledgment that an exercise was tried does not authorize more coding. Keep work limited to the approved change.

## Phase 1: Define the first version and understand the plan

Understand: Requirements describe what the app must do. Scope decides what belongs in this version. Architecture assigns responsibilities to parts. Tools help us build, inspect, and check those parts.

Tasks:

- [x] Choose the project and name: EvenLedger tip and bill splitter.
- [x] Create a dedicated local project folder.
- [x] Choose visual direction: dark charcoal, ivory, restrained gold.
- [x] Choose equal splitting in USD.
- [x] Draft `architecture.md` and this phase plan.
- [x] Explain the HTML/CSS/JavaScript choice and separation between form handling and calculation in the architecture walkthrough.
- [x] Confirm exact-cent share allocation, distributing leftover cents so shares sum to the total.
- [x] Choose a Calculate button instead of calculating while typing.
- [x] Set implementation defaults and document input precision and bounds.
- [x] Record learner revisions: bill starts at 0; editable tip with 15/18/20/22% shortcuts; people start at 2 with 2/3/4/5/8 shortcuts and custom whole-number entry.
- [x] Document the first-version scope and observable completion checks.
- [x] Clarify the architecture checkpoint: color changes affect CSS independently of the calculation. Learner acknowledged the explanation and asked to continue.

Exercise: For a $100 bill, 20% tip, and four people, predict the tip, total, and each share. Then consider why $10 split three ways needs a remainder rule.

Check: The learner can explain what we will build, what we are postponing, and how inputs become results.

Done when: The initial choices and calculation rules are understood and recorded. Drafting documents alone does not complete this phase.

## Phase 2: Set up and build the visible page

Understand: HTML defines the structure; CSS controls its appearance. A local server delivers files to the browser. Git records versions of those files.

Tasks:

- [x] Inspect installed runtime versions and select the local preview and test commands.
- [x] Explain and initialize a separate Git repository in this folder after checking for an enclosing repository.
- [x] Add the minimal page and stylesheet, with the chosen visual direction.
- [x] Add labeled bill, tip, and people controls, results layout, and reset control.
- [x] Add nearby tip shortcuts for 15/18/20/22% and people shortcuts for 2/3/4/5/8, preserving direct input in both fields.
- [x] Write a README with exact setup and preview instructions.
- [x] Serve and inspect the page on desktop and a narrow viewport.
- [x] Review a Git diff, explain staging and commits, and save working progress.
- [x] Learner tried the interface controls and confirmed completing the suggested check.
- [ ] Learner makes a small source change in a later hands-on exercise. Do not infer this from trying the interface.

Exercise: Change one CSS spacing or color value, predict the effect, then inspect it in the browser.

Check: The page opens at the documented URL, is readable on a phone-sized viewport, and exposes usable form controls. Calculations are not required yet.

Done when: The learner can locate and change the page structure and styling, and the layout has been inspected in a browser.

## Phase 3: Calculate and validate

Understand: Functions transform input into output. Validation rejects values the calculation cannot use. Event handling connects form actions to those functions.

Tasks:

- [x] Implement input parsing and pure calculation functions with the agreed money rules.
- [x] Add focused calculation tests for examples, rounding, remainder distribution, and invalid inputs.
- [x] Connect form submission, tip selection, error feedback, results, and reset.
- [x] Keep shortcut selection synchronized with custom typed values; shortcuts fill fields without submitting the form. Implemented early to make the interface usable in phase 2.
- [x] Ensure edited inputs do not leave apparently current results from an earlier calculation.
- [x] Check that displayed shares add up exactly to the displayed total.
- [x] Run the calculation tests and inspect the same behaviors in the served app.
- [x] Review and save working progress in Git.
- [ ] Learner tries the worked calculation example and traces its input -> calculation -> result path.

Exercise: Enter $19.99, 15%, and 2 people, then compare the visible result with the documented example. Explain the actual steps using cents. Revisit a guided debugging exercise later; no deliberate bug was introduced in this phase.

Check: The documented worked examples pass, invalid entries get useful feedback, and errors can be corrected without reloading.

Done when: The calculator works and the learner can explain the relevant functions and how we checked them.

## Phase 4: Review the complete local app

Understand: Automated checks cover repeatable rules; browser inspection checks interactions and the actual interface. Both contribute evidence of working behavior.

Tasks:

- [x] Inspect empty, valid, invalid, edited, and reset states through actual desktop browser interaction.
- [ ] Check keyboard operation, labels, focus, contrast, and narrow-screen layout.
- [x] Review the console. No warning or error logs were present in the current desktop browser test session.
- [x] Refine the design with learner feedback: navy/silver, restaurant image and animation, and 15% starting tip.
- [x] Update the README, run the relevant checks for the visual refresh, and save progress.
- [ ] Introduce GitHub and store the project remotely when the learner is ready.

Check: Perform a complete bill-splitting task on the actual served page using mouse and keyboard. Record the tested URL and actual results below.

Done when: Local first-version criteria are met and any unresolved issues are explicit.

## Phase 5: Publish and make a small second version

Understand: Deployment makes a saved version available at a hosted URL. A Git branch allows an improvement to be developed separately; a pull request makes that change reviewable.

Tasks:

- [x] Confirm Sites is the intended destination described earlier as ChatGPT Pages.
- [x] Run a read-only Sites availability check. Blocked: `sites_access_disabled` in the current workspace.
- [ ] Verify current publishing requirements, account eligibility, any costs, and intended audience.
- [ ] Add only the packaging or hosting configuration actually required.
- [ ] Publish the checked source and verify deployment success and the actual hosted URL.
- [ ] Check calculation, validation, and narrow-screen behavior on the hosted app.
- [ ] Pick one small improvement and practice a branch, review, and release update.
- [ ] Explain how to restore a previous version and record the next useful task.

Check: Use the published link as an intended visitor and verify the app's primary flow. A generated URL alone is not evidence of success.

Done when: The hosted version works and the learner understands how a later change reaches it.

## Session record

### October 21, 2026

Completed: Created the folder and two planning documents. Recorded the learner's name, design, and scope selections. Confirmed Node, npm, Python 3, and Git commands are available; runtime versions and project setup remain for phase 2. Read current official Sites documentation.

Follow-up decisions: The learner confirmed exact-cent share allocation and clarified that Sites is the intended publishing destination. Updated both planning files to reflect these decisions.

Interaction decision: The learner chose a Calculate button. Plan to support Enter through form submission and clear previous results when values change. This behavior is documented but not implemented.

Architecture walkthrough: Selected plain HTML/CSS/JavaScript and separated page handling from calculation functions. Recorded bill, tip, and people rules and defaults. Verified Node v24.13.0, npm 11.6.2, and Python 3.9.6. Git reports this folder is not within an existing repository; that expected result permits a separate repository during setup. Selected a Python local server on port 5180, subject to availability, and Node's built-in test runner. No dependencies installed.

Input revisions: Learner changed the initial bill to 0 and initial people to 2. Tip and people are always editable fields, supplemented by 15/18/20/22% and 2/3/4/5/8 shortcut buttons respectively. Custom entries are not limited to the shortcuts; removed the earlier proposed 100% tip and 100-person caps. Buttons fill values without calculating. Updated `architecture.md` and the relevant build tasks.

Phase 2 implementation: Added `index.html`, `styles.css`, `app.js`, `README.md`, and `.gitignore`. The interface uses charcoal, ivory, gold, and system fonts. Editable fields, shortcuts, reset, and pressed-state synchronization work. Calculate is disabled and a visible preview note explains why. Summary amounts remain placeholders. No calculation module or calculation tests have been created.

Git: Initialized `main`, requested author identity after the first commit attempt found none, and configured only this repository with the name and GitHub no-reply email the learner supplied. Saved the planning baseline. Reviewed the staged interface changes and explained staging and commits; the phase 2 snapshot is `Build EvenLedger interface preview`.

Verification at `http://127.0.0.1:5180/`: Opened in Edge because the in-app browser was unavailable. Checked all four tip and all five people shortcuts; custom tip 17.5 and people 6 clear the selected shortcut; Reset restores 0/18/2 with the matching shortcuts selected. Found and fixed Reset timing by scheduling highlight synchronization after the browser restores defaults. Checked Tab movement, visible focus, and Space activation of a shortcut. Inspected the desktop layout and a 375-by-812 viewport with one-column layout and no horizontal overflow. Browser warning/error log was empty. `node --check app.js` and whitespace checks passed. No monetary behavior has been implemented or tested. No deployment exists.

Local server: Running on port 5180. Starting it required local binding permission; the permitted retry succeeded. README documents how to start and stop it. Desktop and mobile review screenshots are saved temporarily at `/private/tmp/evenledger-desktop.png` and `/private/tmp/evenledger-mobile.png`.

Phase 3: After the learner confirmed trying the interface, added `calculator.mjs` and `calculator.test.mjs`, enabled Calculate/Enter through `app.js`, and replaced preview messaging with real results/errors. Kept the selected architecture and added no dependencies. Uses exact integer cents, rounds the tip once, and groups shares by payment amount. Editing an input or selecting a shortcut clears previous results; reset clears errors and allocation rows. Long amounts use smaller type to stay within the panel.

Phase 3 automated checks: 33 tests cover the three worked examples, custom and zero tips, half-cent rounding, tips above 100%, groups above 100, more people than cents, invalid/missing/over-precise values, safe-integer boundaries, and 245 combinations checking exact rounding and sum/count invariants. BigInt is used only as an independent reference inside that invariant test. JavaScript syntax and Git whitespace checks also passed.

Phase 3 Git milestone: Reviewed and saved the calculation module, tests, page integration, styling, README, and planning updates as `Add exact bill calculations and input validation`.

Phase 3 browser verification at `http://127.0.0.1:5180/` in Edge: Checked $100/20%/4 -> $120 total and $30 each; $10/0%/3 -> $3.34 + two $3.33 shares; $19.99/15%/2 -> $22.99 with $11.50/$11.49; $40/17.5%/6 -> $47 with two $7.84 and four $7.83 shares. Enter submitted $42.50/18%/1 -> $50.15. Negative inputs and zero/fractional people showed the appropriate field messages and focus, correction worked without reload, input/shortcut edits cleared old results, and Reset restored 0/18/2 and removed errors/allocation rows. Initial 0 bill errors only on Calculate. Browser console warning/error log was empty.

Mobile verification: Inspected the uneven split at a 375-by-812 viewport. Tested a $10,099,998.99 total and a group of 9,007,199,254,740,991; neither caused horizontal overflow. Restored the default viewport and left the worked $19.99 example in the live tab. Screenshots are saved temporarily at `/private/tmp/evenledger-calculator-desktop.png` and `/private/tmp/evenledger-calculator-mobile.png`.

Open questions: Learner feedback on calculation behavior; hosting eligibility, packaging, and intended audience. No deployment exists.

Current isolated change: Learner authorized only clearing a zero bill when the field receives focus. Added a focus listener in `app.js` that clears a numeric zero and preserves nonzero amounts. No tip-default change or next-phase work is included.

Focus-change verification at `http://127.0.0.1:5180/` in Edge: Initial 0 cleared on click. Typed 42.50 without a leading zero, blurred, and refocused; 42.50 remained. Reset restored 0, which cleared on the next click and on keyboard focus through Shift+Tab. Empty-bill validation still appeared, and correcting to 100 with the existing 18% tip and 2 people produced $118 total. `node --check app.js` and Git whitespace checks passed. No new automated tests were added for this small interface change. Screenshot: `/private/tmp/evenledger-bill-focus.png`. Saved as `Clear zero bill amount on focus`.

Phase 4, step 1: Learner authorized an experience review, then explicitly requested hands-on browser testing. Used the live Edge page at `http://127.0.0.1:5180/`, clicked controls, and typed numbers using keyboard input. Recorded 21 comparisons against expected UI state; all passed. No application source was changed during this review. Architecture decisions remain unchanged.

Hands-on calculation results:

| Bill | Tip | People | Observed tip | Observed total | Observed exact shares |
| --- | --- | --- | --- | --- | --- |
| $86.45 | 22% | 4 | $19.02 | $105.47 | 3 pay $26.37; 1 pays $26.36 |
| $100.00 | 15% | 2 | $15.00 | $115.00 | 2 pay $57.50 |
| $40.00 | 17.5% | 6 | $7.00 | $47.00 | 2 pay $7.84; 4 pay $7.83 |
| $10.00 | 0% | 3 | $0.00 | $10.00 | 1 pays $3.34; 2 pay $3.33 |
| $42.50 | 15% | 3 | $6.38 | $48.88 | 1 pays $16.30; 2 pay $16.29 |
| $42.50 | 15% | 5 | $6.38 | $48.88 | 3 pay $9.78; 2 pay $9.77 |
| $12.50 | 15% | 2 | $1.88 | $14.38 | 2 pay $7.19 |
| $58.90 | 18% | 8 | $10.60 | $69.50 | 6 pay $8.69; 2 pay $8.68 |
| $58.90 | 20% | 8 | $11.78 | $70.68 | 4 pay $8.84; 4 pay $8.83 |

Other browser checks: All four tip and five people shortcut values were exercised. Custom typed values removed selected shortcut styling. Tested missing bill, missing tip, negative bill/tip, zero people, fractional people, and an over-precise bill; feedback appeared and focus moved to the invalid field. Correcting errors worked without reload. Enter submitted, Space activated a shortcut, bill/shortcut edits cleared old results, Reset cleared totals/errors/allocation and restored defaults, clicking or tabbing into bill 0 cleared it, and refocusing a nonzero bill preserved it. All 21 comparisons passed and the console warning/error log was empty. This pass was desktop Edge only; no new mobile or cross-browser claims. The live tab was left at the $86.45/22%/4 example.

Review evidence: `/private/tmp/evenledger-browser-testing.png` and `/private/tmp/evenledger-browser-test-results.json`. The tip still starts at 18%; the discussed 15% default has not been separately authorized or implemented. Possible wording/readability refinements are subjective review topics, not failed functional checks.

Visual redesign authorization: Learner requested navy and silver instead of the old gold/brown cards, reiterated a 15% starting tip, and asked for restaurant-themed imagery or animation. This explicitly authorized the changes in this work session. Earlier 18% defaults in this session history describe previous builds; the current default is 15%.

Implemented: Rebuilt CSS with navy surfaces and silver controls, updated the favicon/theme color, increased supporting text sizes, and added an editorial dining photo beside the heading. Generated the image with the built-in image tool and saved it under `assets/restaurant-evening.png`, with the exact prompt in `assets/README.md`. CSS animates a slow pan/zoom; `app.js` provides Pause/Play. Reduced-motion CSS disables animations and hides the control. Bill focus, input shortcuts, and calculation rules remain intact. Reset now returns to 0/15/2.

Browser issues found and resolved: Reload initially reused old CSS, leaving new markup styled incorrectly. Versioned stylesheet/script URLs loaded the actual redesigned assets. At narrow widths the motion button crowded the caption; changed it to a compact icon control and reserved caption space below 390px.

Redesign verification: 33 existing calculation tests passed. Fifteen browser comparisons passed, covering initial 15% selection, Reset's 15% value, bill-zero clearing, shortcut and custom calculations, Enter, Pause/Play state, image staying still while paused, actual animation progress when running, narrow-screen error feedback/recovery, and layout/caption geometry at 320px and 375px viewport settings. No horizontal overflow or caption/control overlap remained. Verified the restaurant image loaded at 1536px natural width. Browser warning/error logs were empty. Tests used desktop Edge with viewport overrides, not physical mobile hardware. The viewport was restored afterward.

Current screenshots: `/private/tmp/evenledger-navy-silver-desktop.png` and `/private/tmp/evenledger-navy-silver-mobile.png`. Current checks: `/private/tmp/evenledger-redesign-checks.json`.

Git milestone: Reviewed and saved this change, including the prior review notes, as `Refresh EvenLedger with navy silver restaurant design`.

Publishing readiness check, October 21, 2026: Learner approved compatibility and availability checks only, with no publishing. Read current official Sites creation/management documentation. Verified the clean local source at commit `78675e7`, no existing `.openai/hosting.json`, no configured Git remote, and all relative stylesheet/script/image/module references resolving to local files. The source is a static browser app without a backend, database, external runtime service, or API key. No new app tests were necessary because the source had not changed since the passing checks.

Availability result: `list_sites` returned `SitesConnectorError: Sites is not yet enabled for this workspace.`, error type `sites_access_disabled`. No create, upload, save-version, deploy, access-change, or configuration-write action was attempted. The exact Sites packaging contract and any account costs remain unverified while access is blocked. No app source changed; only planning notes were updated.

Next task: Report the Sites availability blocker and wait for learner direction. Resolve access for the selected account/workspace, then finish packaging checks before proposing any source/configuration changes or publication. Do not select another host or switch accounts without learner direction.

Readability pass, October 21, 2026: Learner reported that all text except the h1 and h2 headings was too small, especially inside the calculator card and the footer. Raised every supporting size — labels, field notes, hints, presets, buttons, form messages, summary lines, header, and footer — and gave the footer one extra step above the rest of the small print. h1 and h2 sizes were left unchanged as requested. Added a cursive "Designed by Nazarian Designs" credit in the footer's left column and bumped the stylesheet query to `navy-silver-3` so browsers pick up the new CSS. Checked desktop and narrow viewports for overflow and confirmed the markup, styles, and calculator are otherwise unchanged.
