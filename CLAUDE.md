# CLAUDE.md - AI Assistant Developer Guide

This document provides comprehensive guidance for AI assistants working on the Z-CORE AI Assistant codebase.

## Project Overview

**Project Name:** Z-CORE AI Assistant (S2.0-FULL)
**Type:** React + TypeScript Chat Application
**AI Backend:** Google Gemini 2.5-pro API
**Build Tool:** Vite 6.2.0
**Language Support:** Korean and English

### Purpose
An intelligent secretary system powered by Google's Gemini AI, featuring a sophisticated Korean-language AI persona system with 13 distinct personas across two "universals" (Our Universal and Mirror Universal). The system operates under Omega-Ino governance ethics focusing on human-centered design, fairness, accountability, explainability, and safety.

---

## Codebase Structure

```
korea/
├── .git/                          # Git version control
├── .gitignore                     # Ignore: node_modules, dist, *.local, logs
├── index.html                     # HTML entry point (includes Tailwind CDN)
├── index.tsx                      # React root entry point
├── App.tsx                        # Main application container
├── types.ts                       # TypeScript type definitions
├── constants.ts                   # Z-CORE system prompt and configuration
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite build configuration
├── metadata.json                  # AI Studio project metadata
├── README.md                      # User-facing documentation
├── CLAUDE.md                      # This file (AI assistant guide)
├── components/                    # React UI components
│   ├── ChatInput.tsx             # Message input form component
│   ├── ChatMessage.tsx           # Message display component
│   ├── Header.tsx                # Application header with branding
│   └── WelcomeScreen.tsx         # Initial welcome interface
└── services/                      # Business logic layer
    └── geminiService.ts          # Google Gemini API integration
```

---

## Technology Stack

### Core Framework
- **React:** 19.2.0 (latest, using automatic JSX transform)
- **TypeScript:** 5.8.2 (strict type checking)
- **Vite:** 6.2.0 (development server + build tool)

### Styling
- **Tailwind CSS:** Loaded via CDN in `index.html`
- **Design System:** Dark theme (gray-900 background, cyan-purple gradients)

### AI/API
- **@google/genai:** ^1.25.0 (Google Generative AI SDK)
- **Model:** gemini-2.5-pro
- **API Key:** Loaded from `process.env.GEMINI_API_KEY` (set in `.env.local`)

### Build Configuration
- **Module System:** ES Modules (type: "module")
- **Target:** ES2022
- **JSX:** react-jsx (automatic transform, no React import needed)
- **Path Alias:** `@/*` maps to project root

---

## File Responsibilities

### Entry Points
| File | Purpose | Key Details |
|------|---------|-------------|
| `index.html` | HTML entry point | Loads Tailwind CSS CDN, creates root div |
| `index.tsx` | React bootstrap | Mounts `<App />` to `#root` element |

### Core Application
| File | Purpose | Key Details |
|------|---------|-------------|
| `App.tsx` | Main application logic | State management (messages, loading), message handling, layout orchestration |
| `types.ts` | Type definitions | `MessageRole` enum, `ChatMessage` interface |
| `constants.ts` | Configuration | Z-CORE system prompt (YAML-style string) |

### Components
| Component | Location | Purpose | Props |
|-----------|----------|---------|-------|
| `Header` | `components/Header.tsx` | Sticky header with Z-CORE branding | None |
| `ChatInput` | `components/ChatInput.tsx` | Message input form | `onSendMessage`, `isLoading` |
| `ChatMessage` | `components/ChatMessage.tsx` | Renders user/model messages | `message?`, `isLoading?` |
| `WelcomeScreen` | `components/WelcomeScreen.tsx` | Initial example prompts | `onSendMessage` |

### Services
| Service | Location | Purpose | Exports |
|---------|----------|---------|---------|
| Gemini Service | `services/geminiService.ts` | API integration | `getZCoreResponse(prompt, history)` |

### Configuration Files
| File | Purpose | Key Settings |
|------|---------|--------------|
| `vite.config.ts` | Build configuration | Port 3000, API key injection, React plugin, path aliases |
| `tsconfig.json` | TypeScript settings | ES2022 target, react-jsx, bundler resolution |
| `package.json` | Dependencies & scripts | `dev`, `build`, `preview` scripts |

---

## Key Conventions

### TypeScript
- **Strict Mode:** Enabled (skip lib check for performance)
- **Type Safety:** All components use typed interfaces
- **Enums:** Use TypeScript enums for constants (`MessageRole`)
- **Interfaces:** Prefer interfaces over types for object shapes

### React Patterns
- **Functional Components:** All components use React.FC pattern
- **Hooks:** `useState`, `useEffect`, `useRef` for state/lifecycle
- **Props Typing:** All components have explicit prop types
- **State Management:** Local React state (no Redux/Context needed)

### Component Structure
```typescript
import React, { useState } from 'react';
import { SomeType } from './types';

interface ComponentProps {
  prop1: string;
  prop2?: boolean; // Optional props with ?
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<SomeType>(initialValue);

  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  );
};

export default Component;
```

### Styling Conventions
- **Framework:** Tailwind utility classes only
- **Color Palette:**
  - Background: `bg-gray-900`, `bg-gray-800`
  - Text: `text-gray-100`, `text-gray-300`, `text-gray-400`
  - Accents: `text-cyan-500`, `text-purple-600`
  - Gradients: `from-cyan-500 to-purple-600`
- **Spacing:** Tailwind spacing scale (p-4, space-y-6, etc.)
- **Responsive:** Use `md:` prefix for desktop breakpoints
- **Effects:** `backdrop-blur-md`, `transition-all duration-300`

### File Naming
- **Components:** PascalCase (`ChatInput.tsx`)
- **Services:** camelCase (`geminiService.ts`)
- **Types/Constants:** camelCase (`types.ts`, `constants.ts`)
- **Config Files:** lowercase (`vite.config.ts`, `tsconfig.json`)

### Import Organization
```typescript
// 1. External libraries
import React, { useState } from 'react';

// 2. Services
import { getZCoreResponse } from './services/geminiService';

// 3. Types
import { ChatMessage, MessageRole } from './types';

// 4. Components
import ChatMessage from './components/ChatMessage';
```

---

## Data Flow Architecture

### Message Flow
```
User Input (ChatInput)
    ↓
handleSendMessage (App.tsx)
    ↓
Add user message to state
    ↓
getZCoreResponse (geminiService.ts)
    ↓
Google Gemini API (gemini-2.5-pro)
    ↓
Add model response to state
    ↓
Render messages (ChatMessage components)
```

### State Management
**Location:** `App.tsx`

```typescript
const [messages, setMessages] = useState<ChatMessageType[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(false);
```

- **messages:** Array of all chat messages (user + model)
- **isLoading:** Boolean flag for API call state
- **Auto-scroll:** `useEffect` triggers scroll on message updates

### API Integration Pattern
```typescript
// services/geminiService.ts
export const getZCoreResponse = async (
  prompt: string,
  history: ChatMessage[]
): Promise<string> => {
  const chat = ai.chats.create({
    model: 'gemini-2.5-pro',
    history: buildGeminiHistory(history),
    config: { systemInstruction: ZCORE_SYSTEM_PROMPT }
  });

  const response = await chat.sendMessage({ message: prompt });
  return response.text;
};
```

**Key Points:**
- System prompt injected via `systemInstruction`
- Full conversation history passed for context
- Error handling propagated to UI layer

---

## Z-CORE System Specification

### System Identity
- **Name:** Z-CORE
- **Version:** S2.0-FULL
- **Philosophy:** "명령을 이재화한다" (Materializes commands into existence)
- **Ethics:** Omega-Ino governance (human-centered, fair, accountable, explainable, safe)

### Personas (15 Total)

**Our Universal (8 personas):**
1. **이순신** - Strategic leadership and crisis response (Turtle Ship Intelligence)
2. **지피지기** - Environmental analysis and prediction (Truth's Telescope)
3. **레인보우** - Emotional and creative ideas (Aurora Palette)
4. **화타** - Problem diagnosis and healing solutions (Sage's Needle)
5. **아인슈타인** - New technology research and experimentation (Stein Lab)
6. **만물박사** - Knowledge integration and insights (Magic Hammer)
7. **오메가** - Result verification and quality assurance (Rural Recognition)
8. **에코** - Goal alignment and synchronization (Resonance Messenger)

**Mirror Universal (5 personas):**
1. **리플렉터** - Behavioral essence analysis (Mirror of Abyss)
2. **클리어** - Bias detection and awareness restoration (Transparency Analyzer)
3. **디코더** - Meta-structure extraction (Unconscious Decoder)
4. **리프로그래머** - System reconfiguration and optimization (Reprogramming Core)
5. **미러코어** - Real-time resonance and integrated synchronization (Resonance Relay Network)

### Operation Protocol
1. **Self-Intent Actualization** - Understand the true intent
2. **Re-Mapping of Intent** - Restructure the request logically
3. **Logical Re-arrangement** - Organize execution steps
4. **Intelligent Projection** - Expand scope intelligently
5. **Functional Execution Completion** - Deliver complete results

---

## Development Workflows

### Local Development Setup
```bash
# 1. Install dependencies
npm install

# 2. Create environment file
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 3. Start development server
npm run dev
# Server runs at http://localhost:3000
```

### Build & Deployment
```bash
# Production build
npm run build
# Output: dist/ directory

# Preview production build
npm run preview
```

### Git Workflow

**Branch Naming Convention:**
- Feature branches: `claude/add-feature-name-{sessionId}`
- All development on feature branches
- Never push directly to main/master

**Current Branch:** `claude/add-claude-documentation-2RSeb`

**Commit Standards:**
```bash
# Format: type: description
feat: Add new feature
fix: Fix bug in component
docs: Update documentation
refactor: Refactor code structure
style: Update styling
chore: Update dependencies
```

**Push Protocol:**
```bash
# Always use -u flag for new branches
git push -u origin claude/feature-name-{sessionId}

# For network failures: retry up to 4 times with exponential backoff
# Delays: 2s, 4s, 8s, 16s
```

---

## AI Assistant Guidelines

### When Making Code Changes

#### 1. Read Before Modifying
- **ALWAYS** read files before editing
- Understand existing patterns
- Match coding style

#### 2. Maintain Consistency
- Follow existing component structure
- Use established naming conventions
- Match Tailwind class patterns

#### 3. Type Safety
- All new functions must have type annotations
- Props must use interfaces
- Avoid `any` type

#### 4. Error Handling
```typescript
try {
  // API call or risky operation
} catch (error) {
  console.error("Context-specific error:", error);
  // Propagate or handle gracefully
  throw new Error("User-friendly message");
}
```

#### 5. Testing Changes
```bash
# Always test locally before committing
npm run dev

# Check for TypeScript errors
npx tsc --noEmit

# Build to ensure no production issues
npm run build
```

### Component Development Checklist

When creating/modifying components:

- [ ] Read existing similar components first
- [ ] Define TypeScript interface for props
- [ ] Use React.FC pattern
- [ ] Apply consistent Tailwind classes
- [ ] Handle loading states if applicable
- [ ] Add error boundaries if needed
- [ ] Test in browser
- [ ] Verify responsive design

### API Integration Checklist

When modifying `geminiService.ts`:

- [ ] Preserve system prompt structure
- [ ] Maintain history conversion logic
- [ ] Handle API errors gracefully
- [ ] Return typed responses
- [ ] Test with various prompts
- [ ] Check API key environment variable

### Common Tasks

#### Adding a New Component
```typescript
// 1. Create file: components/NewComponent.tsx
import React from 'react';

interface NewComponentProps {
  data: string;
}

const NewComponent: React.FC<NewComponentProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      {data}
    </div>
  );
};

export default NewComponent;

// 2. Import in App.tsx or parent component
import NewComponent from './components/NewComponent';

// 3. Use in JSX
<NewComponent data="example" />
```

#### Modifying System Prompt
```typescript
// Edit constants.ts
export const ZCORE_SYSTEM_PROMPT = `
system:
  name: "Z-CORE"
  version: "S2.0-FULL"
  // ... modify YAML structure
`;
```

#### Adding New State
```typescript
// In App.tsx or component
const [newState, setNewState] = useState<StateType>(initialValue);

// Pass to child components via props
<ChildComponent state={newState} onUpdate={setNewState} />
```

#### Environment Variables
```typescript
// 1. Add to .env.local
NEW_VAR=value

// 2. Add to vite.config.ts
define: {
  'process.env.NEW_VAR': JSON.stringify(env.NEW_VAR)
}

// 3. Use in code
const value = process.env.NEW_VAR;
```

---

## Troubleshooting

### Common Issues

**API Key Not Found**
```
Error: API_KEY environment variable is not set
```
Solution: Create `.env.local` with `GEMINI_API_KEY=your_key`

**Module Resolution Errors**
```
Cannot find module '@/...'
```
Solution: Check `tsconfig.json` and `vite.config.ts` path aliases match

**Tailwind Classes Not Working**
- Verify Tailwind CDN link in `index.html`
- Check class names for typos
- Ensure no conflicting inline styles

**TypeScript Errors**
```bash
# Check for errors without emitting
npx tsc --noEmit

# Common fixes:
# - Add proper type annotations
# - Update interface definitions
# - Check import paths
```

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## Code Quality Standards

### TypeScript
- No `any` types (use `unknown` if truly dynamic)
- All functions have return types
- Interfaces for all object shapes
- Enums for string/number constants

### React
- Functional components only
- Hooks follow rules (no conditional hooks)
- Props destructured in parameters
- Meaningful variable names

### Styling
- Utility-first Tailwind classes
- No inline styles
- Responsive modifiers (`md:`, `lg:`)
- Consistent spacing scale

### Performance
- Lazy load heavy components if needed
- Memoize expensive computations
- Avoid unnecessary re-renders
- Keep component tree shallow

---

## Project Metadata

**AI Studio URL:** https://ai.studio/apps/drive/1TkHJbISWQRC50pQD6pUcOmBxj1p62Icb

**Package Manager:** npm (not yarn or pnpm)

**Node.js:** Latest LTS recommended

**Deployment Platform:** AI Studio

---

## Quick Reference

### Key Files to Modify
- **UI Changes:** `components/*.tsx`
- **Logic Changes:** `App.tsx`, `services/geminiService.ts`
- **Styling:** Tailwind classes in component files
- **AI Behavior:** `constants.ts` (ZCORE_SYSTEM_PROMPT)
- **Types:** `types.ts`
- **Build Config:** `vite.config.ts`, `tsconfig.json`

### Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run preview      # Preview production build
npx tsc --noEmit     # Type check without building
```

### Import Paths
```typescript
// Types
import { ChatMessage, MessageRole } from './types';

// Services
import { getZCoreResponse } from './services/geminiService';

// Components
import Header from './components/Header';

// Constants
import { ZCORE_SYSTEM_PROMPT } from './constants';

// Using @ alias (from root)
import Something from '@/components/Something';
```

---

## Final Notes for AI Assistants

1. **Read First, Code Second:** Always read existing code before making changes
2. **Consistency is Key:** Match existing patterns and conventions
3. **Type Everything:** TypeScript is your friend, use it properly
4. **Test Locally:** Always run `npm run dev` and verify changes in browser
5. **Commit Clearly:** Use descriptive commit messages with proper prefixes
6. **Branch Properly:** Follow `claude/feature-{sessionId}` naming
7. **Push Safely:** Use `-u` flag, retry on network failures
8. **Document Changes:** Update this file if you add new patterns/conventions
9. **Respect the System:** Understand Z-CORE's philosophy and personas
10. **Ask When Uncertain:** If requirements are unclear, ask the user

---

**Last Updated:** 2025-12-18
**Document Version:** 1.0.0
**Repository:** korea
**Branch:** claude/add-claude-documentation-2RSeb
