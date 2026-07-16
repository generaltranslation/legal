---
document_type: "reference"
---

# Legal

This repository is the canonical source for General Translation's public legal documents. The landing site and internal company documentation consume pinned commits of this repository as Git submodules.

## Documents

- [United States English](en-US/README.md)

## Publishing

Edit legal text only in this repository. Each consumer must update its submodule pointer through a reviewed pull request before the change is published there.

Documents use plain Markdown so the same source can be indexed by the internal docs app and rendered by the public landing site. Add locale-specific documents under `en-US/` using lowercase, hyphenated route names. Files prefixed with `_` are templates and are not published by the landing site.
