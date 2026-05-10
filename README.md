# Kerfox

Kerfox is an open learning platform built to make high quality academic study materials easier to access, improve, and share.

The goal is simple: education should be open, practical, and available to anyone who wants to learn. This project starts with an interactive university physics exam bank, and is designed to grow across levels and subjects through open source collaboration.

## Why This Project Exists

Many learners struggle with access to well organized revision resources, especially when materials are fragmented or locked behind paywalls.

Kerfox is an attempt to solve that in a practical way:

- Keep learning content in a format that can be improved continuously.
- Make the app simple to run locally for any student or contributor.
- Support community contribution so the platform gets better over time.
- Focus on academic progression, not vanity metrics.

If this project helps someone understand a difficult concept, pass an exam, or feel less alone while studying, then it is doing what it was built to do.

## Current Scope

Kerfox currently includes:

- A Vite + React web application.
- Interactive question browsing for PHYS1204 (Lasers and Quanta).
- Source data and extraction workflow to regenerate question data.
- Room for expansion into GCSE, A-Level, and wider university content.

## Repository Structure

```text
.
|-- app/                    # Frontend application (Vite + React)
|   |-- public/             # Static assets served directly
|   |-- scripts/            # Data extraction and utility scripts
|   |-- src/                # Application source code
|   |-- package.json        # App dependencies and scripts
|   `-- vite.config.js      # Build/dev configuration
|-- data/
|   |-- source-html/        # Canonical source content used by extractor
|   `-- past-papers/        # Past paper assets grouped by level/subject
|-- start.bat               # Windows startup helper
|-- start.sh                # Linux/macOS startup helper
`-- settings.local.json     # Local editor/tooling settings
```

## Requirements

Before starting:

- Install Node.js (LTS recommended).
- Ensure npm is available.
- Clone this repository.

## Running The Project

### Option 1: Start Scripts (Recommended)

Use the script for your operating system from the repository root.

Windows:

```powershell
.\start.bat
```

Linux or macOS:

```bash
./start.sh
```

What these scripts do:

- Check whether Node.js and npm are installed.
- Install dependencies if they are missing.
- Start the development server in app.

### Option 2: Manual Terminal Setup

From repository root:

```bash
cd app
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Build For Production

```bash
cd app
npm run build
```

## Data Extraction Workflow

Question data is generated from source HTML.

Input file:

- data/source-html/PHYS1204_ExamBank_Interactive.html

Generated file:

- app/src/data/questions.js

Regenerate data after editing source HTML:

```bash
cd app
npm run extract
```

## How To Contribute

Contributions of all sizes are welcome, including:

- Bug fixes
- UI and accessibility improvements
- Better explanations or model answers
- New question sets and subjects
- Documentation and onboarding improvements

Suggested contribution flow:

1. Fork the repository.
2. Create a branch with a clear name.
3. Make focused changes.
4. Run the app and verify behavior.
5. Open a pull request with clear notes.

When opening a pull request, include:

- What changed.
- Why it changed.
- How to test it.
- Any screenshots for UI changes.

## Contributing With Agents (Fast Edits and Fixes)

If you prefer to contribute with coding agents, that is welcome too.

Useful approach:

1. Start with a clear task prompt (what to change and why).
2. Ask the agent to scan impacted files first.
3. Ask it to implement focused edits.
4. Ask it to run a validation step (build, lint, or tests if available).
5. Review the diff manually before committing.

Tips for better agent results:

- Keep prompts specific and scoped.
- Ask for minimal changes instead of broad rewrites.
- Request path updates when files are moved.
- Require verification commands after edits.

Example prompt style:

```text
Update the formula panel styles for readability, keep existing layout structure,
and run a production build to confirm there are no regressions.
```

Another example:

```text
Add support for a new topic section in the data model, update dependent components,
and verify all imports and paths are valid.
```

Agent usage should still follow normal review standards. Treat agent output as a draft that must be checked by a human contributor.

## Collaboration Principles

To keep this project healthy and welcoming:

- Be respectful and constructive in reviews.
- Prefer clarity over cleverness in code.
- Write changes so future contributors can understand them quickly.
- Keep education impact in mind when prioritizing work.

## Project Ethos

Kerfox is built around a simple belief: learning should not be gated by privilege.

If you are here to fix a typo, add one topic, improve one explanation, or redesign one feature, your contribution matters. Small improvements compound, and community effort can make high quality education feel less distant for everyone.
