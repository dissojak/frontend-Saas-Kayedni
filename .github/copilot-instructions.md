# Copilot Instructions - frontend-Saas-Kayedni

## Purpose
Use these instructions when creating or updating code in this Next.js frontend.

## Routing and Folder Structure
- Keep page routes under src/app/(pages) with App Router conventions.
- Do not build complex pages in a single file.
- Split page features using folder responsibilities such as data, hooks, lib, utils, providers, types, and components.
- Keep reusable UI in shared component locations instead of duplicating per page.

## Component Boundaries
- Add use client only when required by state, effects, browser APIs, or client-only hooks.
- Prefer server components by default for static or server-driven rendering paths.
- Keep presentational components focused on UI and move side effects/data logic to hooks or data modules.
- Follow existing Tailwind, CVA, and Radix patterns already used in the repository.

## Forms and Validation
- Standardize form implementation on React Hook Form + Zod.
- Keep schema and form state logic close to the feature module, not in random shared files.
- Surface validation errors clearly and consistently.
- Avoid custom ad-hoc validation if a Zod schema already defines the contract.

## Data and Providers
- Keep provider usage consistent with the existing app-level provider hierarchy.
- Keep tracking-related calls aligned with existing tracking helpers and provider flow.
- Avoid scattering data-fetching logic across UI-only components.
- Prefer predictable, typed data flow from API layer to UI layer.

## Code Quality Standards
- Follow clean code conventions and keep complexity Sonar-friendly.
- Use clear naming and avoid ambiguous utility dumping.
- Favor composition over deeply nested conditional rendering in a single component.
- Keep repeated logic in reusable hooks/utilities.

## Anti-patterns To Avoid
- Monolithic page files that combine route, state, side effects, and rendering in one place.
- Adding use client to files that do not need client-only behavior.
- Duplicating shared UI logic inside page-specific folders.
- Bypassing React Hook Form + Zod with manual inconsistent validation.
- Mixing API calls directly into purely presentational components.
- Creating new style patterns that diverge from existing Tailwind/CVA/Radix conventions.
- Ignoring loading/empty/error states for async views.

## Change Checklist
- Is the page split by concern and folder responsibility?
- Is use client truly needed?
- Is form validation done with React Hook Form + Zod?
- Is shared logic reused rather than duplicated?
- Does the change keep design and provider patterns consistent?
