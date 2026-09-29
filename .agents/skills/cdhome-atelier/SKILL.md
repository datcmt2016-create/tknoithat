---
name: cdhome-atelier-project
description: "Project context, conventions, and guidelines for the CDHome Atelier frontend project."
---

# CDHome Atelier - Project Guidelines & Knowledge

## Overview
**CDHome Atelier** is a premium online furniture showroom (frontend application) built to showcase high-end living room, dining room, and bedroom collections, with a feature to request quotes/consultations via Zalo. The project includes both a user-facing showroom and an administrative dashboard.

## Technology Stack
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (v4)
- **Icons & Animations:** `lucide-react`, `motion`
- **Backend/Integrations:** `@google/genai`, Express (for potential backend services in the same monorepo or server middleware)

## Folder Structure (New Standard)
The project structure follows a clean architecture tailored for React applications:

```text
src/
├── assets/       # Static files (images, global CSS if any)
├── components/   # Reusable UI components (Buttons, Cards, Modals, Navbar, Footer)
│   ├── ui/       # Generic UI elements
│   └── admin/    # Admin-specific reusable components
├── layouts/      # Page layouts (MainLayout, AdminLayout)
├── pages/        # Route-level components (HomePage, ProductDetailPage, AdminOverview)
│   ├── admin/    # Admin pages
│   └── public/   # Public-facing pages
├── services/     # API calls, Firebase/Auth logic, local storage
├── data/         # Mock data, constants, initial data states
├── types/        # TypeScript interfaces and type definitions
├── utils/        # Helper functions, formatters (slugify, contact utils)
├── hooks/        # Custom React hooks
├── contexts/     # React Context providers
├── App.tsx       # Main application routing and entry
├── main.tsx      # React DOM rendering entry point
└── index.css     # Global Tailwind imports and CSS variables
```

## Conventions
1. **Components:** Should be highly modular. Avoid putting full pages inside the `components/` directory.
2. **Naming:** PascalCase for React components and files (e.g., `ProductCard.tsx`). camelCase for utility and service files (e.g., `dataService.ts`).
3. **Styling:** Use Tailwind CSS for all styling. Ensure UI feels premium, with subtle micro-animations (using `motion`) and modern typography.
4. **State Management:** Use React state/context. Keep business logic inside `services` or custom `hooks` to keep components clean.

## AI Instructions
When working on this project:
- Always verify the current folder structure before creating new files to maintain organization.
- Premium aesthetics are a priority: use glassmorphism, elegant transitions, and curated colors when adding new UI elements.
- When reorganizing or refactoring, carefully update all import paths.
