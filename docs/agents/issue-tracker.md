# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues in **`shakibdshy/signet-auth-example`**. Use the `gh` CLI for all operations. The local clone has `origin` set to this repo, but the explicit `--repo shakibdshy/signet-auth-example` form is used in the conventions below so commands work from anywhere.

## Conventions

- **Create an issue**: `gh issue create --repo shakibdshy/signet-auth-example --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --repo shakibdshy/signet-auth-example --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --repo shakibdshy/signet-auth-example --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Make an issue a sub-issue of a parent**: `gh issue create --repo shakibdshy/signet-auth-example --parent <parent> ...`, or `gh issue edit <number> --repo shakibdshy/signet-auth-example --add-sub-issue <child>` afterwards (`gh` 2.94+). Older `gh`: `gh api --method POST repos/shakibdshy/signet-auth-example/issues/<parent>/sub_issues -F sub_issue_id=<child-db-id>` (database id, as in **Blocking** below). Without sub-issues, put `Part of #<parent>` at the top of the child body.
- **Comment on an issue**: `gh issue comment <number> --repo shakibdshy/signet-auth-example --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --repo shakibdshy/signet-auth-example --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --repo shakibdshy/signet-auth-example --comment "..."`

The explicit `--repo shakibdshy/signet-auth-example` is kept in every command so these conventions also work from outside the clone.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo treats external PRs as feature requests; `/triage` reads this flag.)_

When set to `yes`, PRs run through the same labels and states as issues, using the `gh pr` equivalents:

- **Read a PR**: `gh pr view <number> --repo shakibdshy/signet-auth-example --comments` and `gh pr diff <number>` for the diff.
- **List external PRs for triage**: `gh api --paginate 'repos/shakibdshy/signet-auth-example/pulls?state=open' --jq '.[] | select(.author_association | IN("OWNER","MEMBER","COLLABORATOR") | not) | {number, title, author: .user.login, author_association, labels: [.labels[].name]}'`.
- **Comment / label / close**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`, each with `--repo shakibdshy/signet-auth-example`.

GitHub shares one number space across issues and PRs, so a bare `#42` may be either: resolve with `gh pr view 42 --repo shakibdshy/signet-auth-example` and fall back to `gh issue view 42 --repo shakibdshy/signet-auth-example`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue in `shakibdshy/signet-auth-example` with `gh issue create --repo shakibdshy/signet-auth-example`.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --repo shakibdshy/signet-auth-example --comments`.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets.

- **Map**: a single issue labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body. `gh issue create --repo shakibdshy/signet-auth-example --label wayfinder:map`.
- **Child ticket**: an issue linked to the map as a GitHub sub-issue (see **Make an issue as a sub-issue of a parent**). Where sub-issues aren't enabled, add the child to a task list in the map body and put `Part of #<map>` at the top of the child body. Labels: `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Once claimed, the ticket is assigned to the driving dev.
- **Blocking**: GitHub's **native issue dependencies**, the canonical, UI-visible representation. Add an edge with `gh api --method POST repos/shakibdshy/signet-auth-example/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`, where `<blocker-db-id>` is the blocker's numeric **database id** (`gh api repos/shakibdshy/signet-auth-example/issues/<n> --jq .id`, _not_ the `#number` or `node_id`). GitHub reports `issue_dependencies_summary.blocked_by` (open blockers only, the live gate). Where dependencies aren't available, fall back to a `Blocked by: #<n>, #<n>` line at the top of the child body. A ticket is unblocked when every blocker is closed.
- **Frontier query**: list the map's open children (`gh issue list --state open --repo shakibdshy/signet-auth-example`), drop any with an open blocker (`issue_dependencies_summary.blocked_by > 0`, or an open issue in the `Blocked by` line) or an assignee; first in map order wins.
- **Claim**: `gh issue edit <n> --repo shakibdshy/signet-auth-example --add-assignee @me`, the session's first write.
- **Resolve**: `gh issue comment <n> --repo shakibdshy/signet-auth-example --body "<answer>"`, then `gh issue close <n> --repo shakibdshy/signet-auth-example`, then append a context pointer (gist + link) to the map's Decisions-so-far.
