# Project Contribution Guidelines

## 1. General Principles
- Write **type‑safe** TypeScript. Enable `strict` compiler options.
- Keep functions **small** and **pure** where possible; side‑effects should be isolated.
- Follow the existing file naming convention: `camelCase` for variables/functions, `PascalCase` for classes/types, and snake_case for database columns.

## 2. Code Formatting
- Use **Prettier** with the project’s default config (run `npm run lint -- --fix`).
- Do not commit generated files (`dist/`, `node_modules/`, `.opencode/`).

## 3. Git Workflow
- Branch from `main` using a descriptive name: `feat/…`, `fix/…`, `chore/…`.
- Keep commits **atomic** – one logical change per commit.
- Ensure the branch is **rebase‑able** onto the latest `main` before opening a PR.
- **GitHub 操作は `gh` CLI を使用**してください。PR の作成、レビュー、マージ、イシュー管理などはすべて `gh` コマンドで行い、スクリプトや CI からの自動化も同様に `gh` を利用します。
- **Default branch は `main` に固定**し、`gh` CLI でも変更しないでください。

## 4. Pull Request Requirements
- Include a clear **title** and concise **description**.
- Reference related issue numbers (e.g., `Closes #12`).
- Verify that the CI pipeline passes (`npm test`, `npm run lint`).
- Add **unit / integration tests** for new functionality.

## 5. Testing
- Place tests under a `tests/` folder mirroring the source structure.
- Use **Vitest** (or the configured test runner) and aim for >80% coverage.

## 6. Documentation
- Update `README.md` or relevant doc files when adding public APIs.
- Keep the **architecture diagram** (`docs/erd.mermaid`) up‑to‑date.

## 7. Security
- Never commit secrets. Use environment variables (`.env`) and add them to `.gitignore`.
- Review third‑party dependencies for known vulnerabilities (`npm audit`).

**⚠️ EOFはNG** – ファイルの末尾に余分な `EOF` 文字列や空行を残さないでください。
---
*These guidelines are enforced by the repository’s CI workflow and will be reviewed during code review.*
