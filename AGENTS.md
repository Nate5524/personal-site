# Agent Guidelines

## Quick Reference

- Tabs for indentation
- Double quotes for strings  
- Proper TypeScript types (avoid `any`)
- Don't annotate return types or const types when TypeScript can infer them. Annotate only when TypeScript would otherwise infer `any`.
- Comments should be only with `//` and should not contain jsdoc syntax
- If you duplicate a substantial block of code, add a comment above it noting the duplication and referencing the original location.
- Default to no comments. Only add one when the why is non-obvious (workaround, hidden constraint, subtle invariant). Never explain what the code does — names handle that. Keep necessary comments to one or two line where possible.
- Keep functions small. With rare exception, a function should do exactly one thing, which should be obvious from the name. 
- In markdown files, do not hard-wrap paragraphs. Let the renderer wrap lines; only insert newlines for actual paragraph or list breaks.