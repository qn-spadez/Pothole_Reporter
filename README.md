# Pothole Reporter (Bengaluru Civic Road Intelligence)

A modern, cloud-based pothole detection and duplicate-aware civic reporting dashboard focused on the Bengaluru metropolitan area (BBMP jurisdiction), India.

---

## 🚀 Quick Start (Running Frontend and Backend)

To experience real AI pothole object detection inference, run both the FastAPI Python backend and the React frontend in separate terminals.

### Terminal 1: Python FastAPI AI Backend

```bash
cd backend

# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On Linux/macOS:
# source .venv/bin/activate

# Start Uvicorn API server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

### Terminal 2: React Frontend

```bash
# In the project root:
npm run dev
```
- App UI: `http://localhost:5173/`
- Vite automatically proxies `/api` calls to `http://127.0.0.1:8000`.

To test the frontend production build:
```bash
npm run build
npm run preview
```

---

## 🛠 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7 (`react-router-dom`)
- **Icons:** Lucide React
- **Geographic Mapping:** Leaflet 1.9 + OpenStreetMap Tiles
- **State Management:** Centralized React Context with automatic `localStorage` persistence and simulated duplicate clustering

---

## 📋 Features Implemented (Phase 1)

### 1. Overview Dashboard (`/`)
- Real-time KPI metric cards (Total reports, Awaiting review, Potential duplicates, High/Critical hazards).
- Stacked report status lifecycle distribution chart.
- Severity and priority triage breakdown.
- Bengaluru BBMP zonal defect summaries (Mahadevapura, Bommanahalli, East, South, West zones).
- Recent complaints table with click-to-inspect drawer.

### 2. Report Submission Page (`/report`)
- Drag-and-drop road defect photograph upload with file type (`jpg`, `png`, `webp`) and size (`<= 10MB`) validation.
- Preset sample road photographs for testing without requiring local camera files.
- Simulated Edge AI Detection preview banner displaying severity and confidence score.
- Browser Geolocation API request triggered only upon explicit user click (`navigator.geolocation`).
- Manual latitude/longitude coordinate entry with validity checking for Greater Bengaluru.
- Quick-pick selector for prominent Bengaluru hotspot corridors (Outer Ring Road Bellandur, 100 Feet Rd Indiranagar, Silk Board Junction, Sony World Signal Koramangala, ITPL Whitefield).
- Full form validation and instant receipt generation with complaint ID (`BLR-2026-XXXX`).

### 3. Interactive GIS Map (`/map`)
- Centered on Bengaluru metropolitan coordinates with OpenStreetMap tile layer.
- Color-coded severity pins (Critical: Red, High: Orange, Medium: Amber, Low: Slate).
- Interactive marker popups featuring photo evidence, ward, status, priority, and direct link to the full report inspector.
- Status and priority filtering controls directly on the map.
- Quick-jump navigation strip to famous road corridors.

### 4. Searchable Reports Table (`/reports`)
- Real-time search across Report ID, Road Name, Description, and Reporter Name.
- Multidimensional filters: Status, Priority, and BBMP Municipal Zone.
- Client-side sorting (Newest, Oldest, Priority, Severity).
- Pagination with customizable page sizes.
- Full slide-out inspector drawer showing high-res evidence, GPS coordinates with Google Maps link, copy button, and simulated geometric measurements (depth in cm, surface area in m²).
- Export capabilities: Download filtered records as standard JSON or GeoJSON for GIS software.

### 5. Duplicate Review Queue (`/duplicates`)
- Spatial clustering engine that identifies reports submitted within 50 meters of existing complaints.
- Side-by-side comparison of Primary Complaint vs. Incoming Candidate Report.
- Computed physical distance (in meters) via Haversine formula and simulated visual cosine similarity score.
- Working triage actions:
  - **Confirm Duplicate & Merge:** Links the incoming ticket to the primary complaint and updates counts.
  - **Reject Match:** Retains both complaints as distinct road defects.

### 6. Application Settings & Tools (`/settings`)
- One-click **Reset Demo Data** to restore original deterministic dataset.
- **Load Extended Dataset (+4 records)** to test pagination and high-density map clustering.
- JSON and GeoJSON data export.
- Configurable spatial duplicate clustering radius (10m - 150m) and visual similarity threshold sliders.
- Auto-escalation rules for critical arterial corridors.

---

## 📁 Project Structure

```
src/
├── types/
│   └── report.ts              # Strong TypeScript models & interfaces
├── data/
│   ├── mockReports.ts         # Deterministic Bengaluru defect data
│   └── mockDuplicates.ts      # Deterministic duplicate pairs
├── context/
│   └── ReportContext.tsx      # Central state provider (local persistence & deduplication)
├── hooks/
│   └── useReports.ts          # Custom hook for consuming reports state
├── components/
│   ├── common/                # Reusable Badges, Buttons, Cards, Modals, Toasts, EmptyStates
│   ├── layout/                # Persistent desktop sidebar, mobile drawer, header layout
│   ├── dashboard/             # StatCards, status & priority distribution charts, ward summary
│   ├── submission/            # Image uploader with validation, GPS location picker
│   ├── reports/               # Searchable reports table, filter bar, slide-out inspector drawer
│   ├── map/                   # Leaflet map container with custom pins, popups & jump controls
│   └── duplicates/            # Side-by-side duplicate candidate card with triage actions
├── pages/
│   ├── DashboardPage.tsx      # / Overview
│   ├── ReportPage.tsx         # /report Form
│   ├── MapPage.tsx            # /map Interactive Map
│   ├── ReportsPage.tsx        # /reports Searchable Table
│   ├── DuplicatesPage.tsx     # /duplicates Triage Queue
│   └── SettingsPage.tsx       # /settings System Settings
├── utils/
│   ├── formatters.ts          # Date, coordinates, and badge helpers
│   ├── geo.ts                 # Haversine distance & Bengaluru hotspot presets
│   └── export.ts              # GeoJSON & JSON export utilities
├── App.tsx                    # React Router configuration
├── main.tsx                   # Application entry point
└── index.css                  # Tailwind CSS & Leaflet custom styling
```

---

## 🔒 Project Status & Scope Boundaries

- **Phase 1 (Complete):** Modern civic-tech dashboard frontend with deterministic client-side demo data, local storage persistence, responsive UI, Leaflet GIS map with BBMP zones, and duplicate review triage.
- **Phase 2 (Complete):** Python FastAPI backend with real YOLOv8 object detection inference (`Samdutse/pothole-yolov8`), verified bounding box coordinates, model confidence outputs, annotated image rendering, and robust error handling without synthetic depth hallucination.
- **Phase 3 (Upcoming):** Supabase integration for multi-user authentication, PostGIS spatial queries, and S3-compatible cloud storage.
