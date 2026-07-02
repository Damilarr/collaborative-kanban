# Alignio Tasks — Collaborative Kanban Board

Alignio Tasks is a high-fidelity, fully responsive Kanban board application I built using **Next.js**, **React 19**, and **Tailwind CSS**. I designed it to model professional task workflows with a premium design aesthetic, featuring native drag-and-drop mechanics, client-side validation, and URL-synchronized modal state.

---

## Architectural Decisions

### 1. Framework: Next.js (App Router) & React 19
I leveraged the Next.js App Router for page layouts and standard client-side state hooks. Using React 19 keeps the app aligned with the latest performance and rendering enhancements. I designed a clean, modular structure:
- `page.tsx` acts as the entry shell using a `<Suspense>` wrapper.
- Modular component design separates the board wrapper, columns, cards, and modal forms.

### 2. Zero-Dependency Custom Drag-and-Drop
Instead of importing large, opinionated third-party libraries (e.g., `react-beautiful-dnd`, `@dnd-kit`, or `react-dnd`), I implemented a native **HTML5 Drag and Drop** interface.
- **Why?** It ensures minimal JS bundle overhead, gives me direct control over styling triggers, and runs at native browser speeds.
- **Details:** I used event handlers like `onDragStart`, `onDragEnd`, `onDragOver`, and `onDrop`. Column drop zones outline themselves with a dashed border and an orange-tinted background highlight when cards are hovered over them. Cards scale down and fade slightly when dragged.

### 3. URL-Synchronized Modal State
I synchronized the state of the **Create Task** and **Edit Task** modals with the browser's URL search parameters:
- `?modal=create-task` opens the creation form.
- `?modal=edit-task&taskId=task-id` opens the edit form for that specific task.
- **Why?** Deep-linking ensures that page reloads or shared links preserve the modal's open state, improving usability and preventing state loss when refreshing.

### 4. Client-Side Persistent State via Custom Hooks
I centralized the core business logic of managing tasks in `src/hooks/useKanbanData.ts`.
- State operations (adding, editing, updating columns, and deleting tasks) are kept in sync with the browser's `localStorage` so data survives page refreshes.
- I used the lightweight `sonner` package to trigger interactive toasts and notifications on all task mutations.

### 5. Custom Inline SVG Icons & Pure Styling
To keep the application fast and avoid visual discrepancies:
- **No Icon Libraries:** I avoided standard icon libraries (e.g., `lucide-react`) in favor of hand-tuned inline SVGs in `src/components/Icons.tsx`.
- **Pure Styling:** I built the interface with Tailwind CSS (v4) and native CSS transitions. Skeleton shimmer loaders run on mount to mock data fetching before smoothly transitioning to the full board view.

---

## Folder Structure

```text
src/
├── app/
│   ├── globals.css      # Core styles, Tailwind setup, animations (shimmer, slideDown)
│   ├── layout.tsx       # Root layout containing SEO metadata & Toast wrappers
│   └── page.tsx         # Main entry point with Suspense shell
├── components/
│   ├── Icons.tsx        # Optimized custom SVG icon library
│   ├── KanbanBoard.tsx  # Search, sort, priority filters, and layout tabs
│   ├── KanbanColumn.tsx # Column components handling drag-and-drop targets
│   ├── KanbanCard.tsx   # Card representations, delete actions, priority tags
│   ├── TaskModal.tsx    # Modal form handling task creation and editing
│   └── SkeletonLoader.tsx # Loading skeleton shown on initialization
└── hooks/
    └── useKanbanData.ts # Centralized hooks for tasks, state mutations, and storage
```

---

## How to Run the Solution

Ensure you have **Node.js (version 18 or above)** installed on your machine.

### 1. Install Dependencies
Navigate to the project root and run:
```bash
npm install
```

### 2. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser to interact with the Kanban board.

### 3. Build for Production
To build the application for production, run:
```bash
npm run build
```

Once the build finishes successfully, start the production server locally:
```bash
npm run start
```

### 4. Linting
Verify code styling and catch any syntax or TypeScript errors:
```bash
npm run lint
```
