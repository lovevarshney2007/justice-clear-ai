

# Justice-Clear Legal AI — Frontend Build Plan

## Overview
A polished Legal-Tech SaaS frontend with mock API integration, animations, and a professional navy/gold design system. All API calls will use mock data initially, structured to easily swap in the real `localhost:4000` backend later.

## Design System
- **Primary:** Deep Navy `#0f172a`, **Accent:** Amber/Gold `#d97706`, **Background:** `#f8fafc`
- Glass-morphism cards, Framer Motion page transitions & staggered animations
- Lucide React icons, Recharts for data viz, toast notifications on all actions

## Pages & Features

### 1. Auth Pages (Public)
- **Login & Register:** Split-screen layout (illustration left, form right), animated transitions
- **OTP verification modal** after registration
- **Forgot Password** flow with email input → reset token page
- Auth context storing JWT token, protecting all other routes

### 2. Dashboard (Protected)
- Hero section with system health status (mock `/health` & `/chat-status`)
- Animated quick-action grid: 5 cards linking to Case Predictor, AI Chat, Web Summarizer, Document Analyzer, Legal Search
- Recent Documents table from mock `/history`

### 3. Case Prediction Engine
- Interactive form: dropdowns for case type, sliders for lawyer/judge experience, number input for judge count
- Animated gauge chart (Recharts) showing win probability on submit
- Skeleton loading state during "prediction"

### 4. Dual AI Chat Workspace
- Two-tab chat interface (Vakil Sahab / RAG Assistant)
- ChatGPT-style bubbles with markdown rendering, typing indicator, auto-scroll
- Connects to mock `/ask-vakil`, `/chat-agent`, `/chat` endpoints

### 5. Web Summarizer
- Large URL input bar with paste detection
- Scanning/loading animation, then structured summary card
- Mock `/summarize-web` endpoint

### 6. Legal Web Search
- Search bar with expanding result cards
- Mock `/search` endpoint with sample legal results

### 7. Document Hub
- **Process tab:** Drag-and-drop PDF upload zone → risk analysis card
- **RAG Upload tab:** File upload to add context for chat model
- **Blog Manager tab:** Grid of blog cards with read/delete actions
- Mock endpoints for `/process`, `/upload`, `/blogs`

## Technical Architecture
- **Routing:** React Router with protected route wrapper
- **State:** React Context for auth, React Query for API calls
- **API Layer:** Centralized service files with mock responses, configurable base URL
- **Animations:** Framer Motion for page transitions, list staggering, hover effects, loading states
- **New dependencies:** `framer-motion`, `react-dropzone`, `react-markdown`

## File Structure
```
src/
  contexts/AuthContext.tsx
  services/api.ts (base config + interceptors)
  services/auth.ts, ml.ts, document.ts, rag.ts
  pages/Login, Register, ForgotPassword, ResetPassword
  pages/Dashboard, CasePredictor, ChatWorkspace
  pages/WebSummarizer, LegalSearch, DocumentHub
  components/ProtectedRoute, ChatBubble, GaugeChart, FileDropzone, BlogCard
```

