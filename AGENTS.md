# Repository Agent Rules

- Work from the repository root unless a task explicitly requires a subfolder.
- Keep persistent implementation files in the root or the existing app folders under the root.
- Do not add new work files inside `.claude/` or any agent-specific folder.
- Temporary agent folders are allowed only if they are deleted before finishing; otherwise add them to `.gitignore`.
- If you need startup scripts, place them in the repository root.
- Do not hide implementation inside tool or agent workspace folders.