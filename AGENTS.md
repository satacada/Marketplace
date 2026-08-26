<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 🚨 MANDATORY AI AGENT GUIDELINES & STANDARDS

All AI agents (Antigravity, Cursor, Windsurf, Claude Code, GitHub Copilot, ChatGPT) working on this repository MUST strictly follow the project standards defined in:

- **`docs/standards/README.md`** (Central Index)
- **`docs/standards/ux_specialist_guide.md`** (UX & Mobile-First Standards)
- **`docs/standards/frontend_architecture_guide.md`** (Front-End Architecture & Core Web Vitals)
- **`docs/standards/security_patterns.md`** (OWASP, Supabase RLS & PKCE Auth)
- **`docs/standards/design_patterns.md`** (UI Colors `#2563eb`, SVG Icons, Compact Cards & Modals)
- **`docs/standards/scalability_patterns.md`** (Caching, Cursors, Guest Cart & Database Indexing)
- **`docs/standards/traceability_and_testing_guide.md`** (Change Traceability, Code Modularity & Zero-Error Testing)
- **`docs/standards/enterprise_architecture_guide.md`** (Amazon, Google & AliExpress Enterprise Architecture Standards)

## MANDATORY RULES:
1. BEFORE writing code: Read `docs/standards/` to ensure full alignment.
2. ZERO compilation errors: Always verify changes using `npx tsc --noEmit` and `npm run build`.
3. PRESERVE guest cart & postponed registration flow.
4. USE standard `<Modal>` component instead of browser native `alert()`.

