# AETHERIX presents AFTER THE FIRE
## Post-Wildfire Geospatial Research Platform

> An interactive research initiative combining satellite intelligence and watershed analysis to investigate post-wildfire landscape changes in Big Sur, California.

---

## 1. System Overview

**AETHERIX presents AFTER THE FIRE** is a production-grade geospatial research application designed to investigate post-wildfire vegetative recovery, sensor concordance, and watershed vulnerability across California's Santa Lucia Range (Big Sur, Monterey County, California — 36.2704° N, 121.8081° W).

The platform integrates:
- **Sentinel-2 MSI Radiometry**: Multi-spectral Normalized Burn Ratio ($NBR$) and differential $dNBR$ across 20m SWIR bands (B8: 842nm, B12: 2190nm).
- **NISAR L-Band Radar Backscatter**: Dual-polarization ($VV/VH$) Synthetic Aperture Radar ($24\text{ cm }\lambda$) penetrating coastal fog, smoke, and charred canopy skeletons.
- **USGS 3DEP LiDAR Terrain Models**: High-resolution digital elevation models identifying steep catchments ($>30^\circ$) susceptible to post-fire runoff and debris flows along California State Route 1 (Highway 1).

---

## 2. Complete Architecture

### A. Public Website (`/`)
Continuous scrolling single-page editorial presentation:
1. **Welcome**: Hero with live MapLibre Big Sur geospatial visualization, burn perimeter layers, and direct dashboard CTA.
2. **About the Project**: Scientific overview of the Santa Lucia study area with genuine geographical map preview.
3. **Our Vision**: Core guiding statement and research pillars (Sensor Synergy, Catchment Vulnerability, Open Science Cartography).
4. **Meet Our Team**: Exactly **two** research leads with clean editorial styling and direct contact/LinkedIn links:
   - **Rajesh Kumar Swain**
   - **Abankita Behera**
5. **Contact & Feedback**: Interactive tabs for inquiries and peer feedback, validated with Zod and connected to Resend endpoints.
6. **Footer**: Georeferenced coordinate frame (EPSG:32610 UTM Zone 10N), platform metadata, and legal attribution.

### B. Research Dashboard (Shared Top-Nav, Exactly 5 Routes)
Cupertino-style horizontal navigation (`AFTER THE FIRE | OVERVIEW | FIRE OVERVIEW | SATELLITE ANALYSIS | WATERSHED ANALYSIS | RESULTS`):
- `/dashboard/overview`: High-acuity interactive map, study area boundaries, core satellite datasets, and preliminary inventory (11 HUC-12 units, 20 pre-fire scenes, 34 post-fire scenes).
- `/dashboard/fires`: Interactive fire complex boundary visualization with Timber (5,800 ha) and Plaskett (7,420 ha) isolation pills, flyTo camera transitions, and burn severity area statistics.
- `/dashboard/satellite`: Three analysis modes (**OPTICAL** | **RADAR** | **COMBINED**), formula metrics, polarization selection ($VV/VH$), sensor concordance matrix, and draggable before/after comparison slider.
- `/dashboard/watersheds`: Interactive HUC-12 catchment map, dynamic polygon selection, 11-basin ranking table, steep slope ($>30^\circ$) percentages, and scientific debris-flow disclaimer.
- `/dashboard/results`: Recharts-driven visual synthesis, sensor concordance pie chart, catchment monitoring priority bar chart, Timber vs. Plaskett fuel comparisons, and scientific limitations.

---

## 3. Cross-Platform Docker Execution (Windows & macOS)

The application provides a multi-stage Docker build with Nginx for portable, identical execution on **Windows (Docker Desktop)**, **macOS (Apple Silicon M1/M2/M3/M4 & Intel)**, and **Linux**.

### Prerequisites
- Install **Docker Desktop** on Windows or macOS (or Docker Engine on Linux).
- Docker Compose v2.0+ (bundled with Docker Desktop).

### Quick Start with Docker Compose

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd aetherix
   ```

2. **Configure environment:**
   Create `.env.local` by copying `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Set your CARTO basemap key in `.env.local`:
   ```env
   VITE_CARTO_BASEMAPS_KEY=cb1_59lw_1_b
   VITE_MAPTILER_API_KEY=
   ```

3. **Build and launch container:**
   ```bash
   docker compose --env-file .env.local up --build -d
   ```

4. **Access the application:**
   Open your browser to:
   ```
   http://localhost:8080
   ```
   Direct dashboard route navigation is supported through Nginx SPA fallback:
   - `http://localhost:8080/dashboard/overview`
   - `http://localhost:8080/dashboard/fires`
   - `http://localhost:8080/dashboard/satellite`
   - `http://localhost:8080/dashboard/watersheds`
   - `http://localhost:8080/dashboard/results`

5. **View container logs:**
   ```bash
   docker compose logs -f
   ```

6. **Stop container:**
   ```bash
   docker compose down
   ```

---

## 4. Local Development (Node.js Workflow)

If developing locally without Docker:

```bash
# Install dependencies
npm install

# Run Vitest test suite
npm test

# Run TypeScript type check
npx tsc --noEmit

# Start Vite development server
npm run dev
```

Dev server default URL: `http://localhost:5173`

---

## 5. Team Configuration

Consortium member details are centralized in:
`src/config/team.ts`

```typescript
export interface TeamMember {
  name: string;
  email: string | null;
  linkedinUrl: string | null;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Rajesh Kumar Swain',
    email: null,        // Set when available (e.g. 'rajesh@example.com')
    linkedinUrl: null,  // Set when available (e.g. 'https://linkedin.com/in/...')
  },
  {
    name: 'Abankita Behera',
    email: null,
    linkedinUrl: null,
  },
];
```

When contact URLs are pending, the UI displays consistent, accessible disabled state icons. When configured, icons automatically activate native `mailto:` links and new-tab LinkedIn navigation.

---

## 6. Basemap Authentication (CARTO & MapTiler)

The platform includes a robust map service (`src/services/mapService.ts`) with graceful fallbacks:
1. **MapTiler** (Primary if `VITE_MAPTILER_API_KEY` is present): High-resolution satellite orthomosaics, hybrid terrain, and topo maps.
2. **CARTO Basemaps** (Authenticated fallback if `VITE_CARTO_BASEMAPS_KEY` is provided): Dark Matter and Voyager basemaps using CARTO's authenticated tile infrastructure. All tile requests pass `?api_key=` through MapLibre's `transformRequest` hook, avoiding authentication watermarks.
3. **OpenStreetMap Development Basemap**: Clean fallback for local testing when no external API keys are configured.

---

## 7. Multi-Platform Docker Buildx (Optional Publishing)

To build and push a multi-architecture image supporting both `linux/amd64` and `linux/arm64`:

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --build-arg VITE_CARTO_BASEMAPS_KEY=cb1_59lw_1_b \
  -t aetherix/after-the-fire:latest .
```

---

## License & Attribution

© 2026 AETHERIX presents AFTER THE FIRE · Big Sur Ecological Resilience Initiative.
Open Access Scientific Geospatial License.
Basemaps © CARTO, © MapTiler, © OpenStreetMap contributors.
USGS 3DEP LiDAR courtesy of U.S. Geological Survey.
Copernicus Sentinel data [2026] processed via ESA Sentinel-2 MSI radiometry.
