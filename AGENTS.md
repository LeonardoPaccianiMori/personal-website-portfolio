# Portfolio Agent Instructions

This repository is the public portfolio downstream of Leonardo's private
canonical career record. Treat existing public content and repository evidence
as supporting sources, not authority for new personal facts. Never publish
private material merely because it is available in another workspace.

## Change control

Before tracked changes, inspect the current branch, remote state, applicable
instructions, affected files, and worktree. Present a repository-specific plan
that names the files, intended behavior or wording, validation, commit message,
and push. Wait for Leonardo's explicit approval.

Preserve unrelated user changes and stage only the approved scope. Do not
rewrite published history unless Leonardo explicitly requests the exact
rewrite and approves a dedicated destructive-action plan with recovery and
force-with-lease safeguards.

Subagents may perform independent, bounded, read-only source comparison,
repository inspection, research, or critical review when parallel work adds
material value. The primary agent owns conversation, interpretation, approval
plans, all edits, validation, commits, and pushes.

## Validation and user-led visual review

Use proportionate noninteractive checks:

- Every change receives `git diff --check`, a complete scoped diff review, and
  a narrow supported formatting or syntax check for each changed source file.
- Limit any formatting write to approved changed files. Never run
  repository-wide `npx prettier . --write` or an equivalent broad rewrite in a
  scoped task, especially when the worktree contains unrelated changes.
- Prose-only Markdown changes receive applicable front-matter, date, link, and
  asset-path checks. They do not require a full site build by default.
- Build-affecting Liquid, layout, include, configuration, plugin, dependency,
  navigation, asset-path, and relevant HTML, CSS, or JavaScript changes receive
  a noninteractive Jekyll build.
- Dependency changes also require lockfile and security-impact review.

Local serving and browser inspection are opt-in. Do not start Docker serving,
Jekyll serving, another local HTTP server, Playwright, Chrome or Browser Use,
capture screenshots, or inspect desktop or mobile rendered pages unless
Leonardo explicitly requests it or approves it as a named validation step. A
visual change alone does not authorize those actions.

These rules override inherited `.github` instructions wherever those files
describe local serving, browser review, or repository-wide formatting writes
as mandatory. When visual review is omitted, report it as not requested or not
performed, never as passed. Leonardo will review the website after it is pushed
and accepts final responsibility for the published presentation; this does not
remove the requirement for the applicable source-level and noninteractive
checks above.

## Completion

Commit and push only the approved scope. Report validation results, the commit
hash, the push result, preserved unrelated worktree changes, and every check
that was intentionally omitted. Do not poll deployment services, inspect live
deployment status, or wait for propagation unless Leonardo explicitly asks.
