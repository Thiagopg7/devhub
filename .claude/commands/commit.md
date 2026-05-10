Generate a conventional commit message for the current staged changes.

1. Run `rtk git diff --staged` to see what's staged
2. Write a commit message following Conventional Commits:
   - Format: `type(scope): short description`
   - Types: feat, fix, refactor, test, chore, docs, style
   - Keep subject under 50 chars, in English
   - Add a body if the change needs explanation
3. Run `git commit -m "<message>"`
4. Report the commit hash