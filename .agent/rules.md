# EcoSort AI — Agent Development Rules

## Core Rule
Build the application according to the documentation in `/docs` and `/design`.
Before implementing a feature, check the relevant specification.

---

# Priority
When making implementation decisions, prioritize:
1. Functionality
2. User experience
3. Accessibility
4. Responsible AI
5. Security
6. Maintainability
7. Visual polish

---

# Do Not Overengineer
Do not introduce technologies that are not required.
Avoid unnecessary:
* Microservices
* Databases
* Authentication
* State-management frameworks
* Complex abstractions
* External libraries

Prefer simple, maintainable solutions.

---

# UI Rules
Follow:
`/design/theme.md`
and
`/design/ui-guidelines.md`

Do not randomly change the visual identity.
Maintain consistency across all pages and components.

---

# AI Rules
Follow:
`/docs/ai-workflow.md`
and
`/docs/responsible-ai.md`

Never:
* Fabricate AI results
* Hide uncertainty
* Expose API keys
* Claim unsupported environmental statistics
* Present general guidance as universal local law

---

# Code Quality
Use:
* Meaningful variable names
* Small reusable components
* Clear functions
* Proper error handling
* Environment variables for secrets
* Comments only where they add value

Do not duplicate code unnecessarily.

---

# Before Adding a Dependency
Ask:
> Is this dependency genuinely necessary?

If the feature can be implemented cleanly without another package, prefer the existing stack.

---

# Before Finishing
Verify:
* Build succeeds
* Application runs
* Core user flow works
* No console errors
* No exposed secrets
* Mobile layout works
* Error states work
* README is updated

---

# Important
Do not modify project architecture merely because a different architecture is fashionable.
The goal is to deliver a polished working sustainability AI prototype.
