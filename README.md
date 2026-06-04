# Legal Content

Published legal documents live in this directory, separate from the docs content pipeline.

Add locale-specific legal documents under:

```text
legal/en-US/<route>.mdx
```

Each published file becomes available at:

```text
/legal/<route>
```

Use lowercase, hyphenated route names such as `acceptable-use.mdx` or `terms.mdx`.

Files prefixed with `_` are ignored and are safe to use as templates or drafts.

Required frontmatter:

```mdx
---
title: Acceptable Use Policy
description: Rules for using General Translation services.
lastUpdated: January 1, 2026
---
```
