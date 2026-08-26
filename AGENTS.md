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
5. ALWAYS FOLLOW INCREMENTAL MODULAR PROTOTYPING ("CLEAN-BY-DESIGN"): Never write rough monolithic code. Every new feature or page MUST immediately be built with its dedicated Custom Hook (`src/features/<module>/hooks/`) and sub-components (< 100 lines) with JSDoc headers from line 1.

## 🚀 MANDATORY METHODOLOGY: INCREMENTAL MODULAR PROTOTYPING ("CLEAN-BY-DESIGN")
All AI agents MUST enforce this 3-step workflow on EVERY prompt:
1. **Clean-by-Design Construction:** Build feature logic inside a Custom Hook and UI in sub-components (< 100 lines) right from prompt #1. No draft monoliths allowed.
2. **Surgical Iteration:** If the user requests UI/UX visual adjustments, edit ONLY the specific sub-component without touching the Hook or database logic.
3. **Instant Production Lock-In:** Always verify with `npx tsc --noEmit` and `npm run build` before completing.

