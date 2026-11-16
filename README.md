# AETHERIX presents AFTER THE FIRE

**A post-wildfire geospatial research platform for Big Sur, California**

**Live URL**: [project-aetherix.vercel.app](https://project-aetherix.vercel.app/)

AFTER THE FIRE is an interactive research platform developed by **AETHERIX** to examine post-wildfire landscape changes across the Timber and Plaskett fire study areas in Big Sur, Monterey County, California, USA. It brings together optical satellite observations, L-band radar observations, fire perimeters, watershed boundaries and terrain information to support spatial investigation and watershed monitoring prioritisation.

The platform consists of a public-facing project website and a five-page interactive research dashboard. It presents precomputed geospatial products; computationally intensive satellite processing is performed outside the browser.

> **Scientific scope:** The dashboard supports post-fire landscape-change analysis and relative watershed monitoring prioritisation. A monitoring-priority score is not a validated debris-flow probability, forecast or substitute for field investigation.

---

## Contents

- [Project at a glance](#project-at-a-glance)
- [Research objectives](#research-objectives)
- [Data and methodology](#data-and-methodology)
- [Website structure](#website-structure)
- [Technology stack](#technology-stack)
- [Data assets and configuration](#data-assets-and-configuration)
- [Run locally](#run-locally)
- [Run with Docker](#run-with-docker)
- [Environment variables](#environment-variables)
- [Testing and production build](#testing-and-production-build)
- [Team](#team)
- [Scientific interpretation and limitations](#scientific-interpretation-and-limitations)
- [Data attribution and software license](#data-attribution-and-software-license)
- [Contributing](#contributing)

---

## Project at a glance

| Item | Description |
|---|---|
| Project | AFTER THE FIRE |
| Team | AETHERIX |
| Study area | Big Sur, Monterey County, California, USA |
| Study events | Timber Fire and Plaskett Fire (2026 study) |
| Geographic reference | UTM Zone 10N, EPSG:32610 for project analysis |
| Primary observations | Sentinel-2 optical imagery and NISAR GCOV radar products |
| Supporting data | Fire perimeters, HUC-12 watersheds and elevation/terrain data |
| Application | Public project website and five-page research dashboard |

The approximate study-area reference coordinate is **36.2704° N, 121.8081° W**. It is provided as geographic context; the actual map extent and fire boundaries must come from the project geospatial data.

### Initial processing inventory

The project handover records the following initial availability figures:

| Inventory item | Initial count |
|---|---:|
| Pre-fire Sentinel-2 scenes | 20 |
| Post-fire Sentinel-2 scenes | 34 |
| HUC-12 watersheds intersecting the initial study area | 11 |

These are **initial processing inventory figures**, not final validated research results. Scene counts and watershed counts should be updated only from the relevant processing outputs.

---

## Research objectives

The platform is designed to help users:

1. Explore the Timber and Plaskett fire locations and their geographical extent.
2. Examine pre-fire and post-fire landscape observations using Sentinel-2.
3. Investigate radar backscatter changes using available NISAR GCOV observations.
4. Compare optical and radar observations and explore where their change signals agree or differ.
5. Examine the distribution of observed changes across HUC-12 watersheds and terrain.
6. Identify watersheds that may warrant closer monitoring using the project's stated prioritisation methodology.

---

## Data and methodology

### Sentinel-2 optical observations

The project handover identifies **Copernicus Sentinel-2 Level-2A Surface Reflectance** imagery (`COPERNICUS/S2_SR_HARMONIZED`) for optical analysis.

The documented initial observation windows are:

- **Pre-fire:** 15 July 2026 to 7 August 2026.
- **Post-fire:** 1 September 2026 to 14 October 2026.

The documented processing uses the Scene Classification Layer (SCL) to mask classes 1, 3, 8, 9, 10 and 11. The Normalized Burn Ratio is calculated using near-infrared band B8 and short-wave infrared band B12:

\[
NBR = \frac{B8 - B12}{B8 + B12}
\]

Differenced NBR is calculated as:

\[
dNBR = NBR_{pre} - NBR_{post}
\]

Positive dNBR indicates a decline in NBR and is consistent with burn-related vegetation or surface change. It should not automatically be treated as confirmed burned area. B8 and B12 have different native spatial resolutions; the resolution and resampling method used for each final output must be taken from the actual processing configuration and raster metadata.

### NISAR radar observations

The project uses **NISAR L-band GCOV** observations to investigate pre-fire and post-fire radar backscatter behaviour and spatial change.

The planned radar products include:

- Pre-fire backscatter.
- Post-fire backscatter.
- Radar backscatter change.
- Radar statistics by fire and watershed.

Polarisation options must be driven by the bands actually present in the selected GCOV products and their metadata. The interface must not assume that a particular pair of channels is available for every product. The project handover calls for VV/VH selection where available; the final display must follow the actual product metadata.

### Watersheds and terrain

The project uses **USGS HUC-12 watershed boundaries** to identify and analyse watersheds intersecting the fire study area. Watershed statistics in the handover include watershed area, fire-intersecting area, percentage intersecting the fire, mean dNBR, positive dNBR area, and percentage of valid area with positive dNBR.

Terrain analysis supports elevation and slope summaries, including mean watershed elevation, mean slope and the percentage of watershed area with slope greater than 30 degrees.

**Elevation dataset clarification:** The supplied technical processing handover identifies `USGS/SRTMGL1_003` (approximately 30 m) for DEM and slope processing. This README therefore does not describe the current workflow as USGS 3DEP LiDAR. If the implemented processing pipeline has since been changed to 3DEP, update this section and the data-source metadata to match the actual input rasters before describing them as LiDAR-derived.

### Optical–radar comparison

The dashboard is intended to present three analytical views:

1. **Optical-only:** Sentinel-2 NBR and dNBR outputs.
2. **Radar-only:** NISAR GCOV backscatter and change outputs.
3. **Combined:** spatial comparison of optical and radar change signals, including areas of agreement and disagreement.

Agreement or concordance metrics must be calculated from the actual processed comparison data. They must not be represented by illustrative or fabricated percentages.

---

## Website structure

The website has two connected experiences: a single-page public project website and a five-page research dashboard.

### Public project website

The public website is one continuous scrolling page with the following sections:

1. **Welcome** — project introduction, Big Sur geospatial hero visual and link to the research dashboard.
2. **About the Project** — concise explanation of the study area, observations and research purpose.
3. **Our Vision** — the project's guiding statement and research objectives.
4. **Meet Our Team** — exactly two team members: Rajesh Kumar Swain and Abankita Behera.
5. **Contact & Feedback** — contact and feedback forms, subject to backend/email configuration.
6. **Footer** — project identity, navigation and source attribution.

### Research dashboard

The dashboard contains exactly five main pages, accessed through a shared horizontal navigation bar.

| Route | Page | Purpose and primary features |
|---|---|---|
| `/dashboard/overview` | Home / Overview | Introduces the project; shows Timber and Plaskett locations, an interactive study-area map, fire boundaries, datasets, objectives and the analysis workflow. |
| `/dashboard/fires` | Fire Overview | Explores both fire boundaries, fire selection, available fire information and statistics, pre-/post-fire context, terrain overlays, zoom/layer controls and acquisition timeline. |
| `/dashboard/satellite` | Satellite Analysis | Presents Sentinel-2 optical analysis, NISAR radar analysis, temporal pre-/post-fire comparison, side-by-side optical/radar comparison and sensor agreement/disagreement. |
| `/dashboard/watersheds` | Watershed Analysis | Provides an interactive HUC-12 map, watershed selection and statistics, elevation/slope layers, steep-terrain summaries and monitoring-priority rankings. |
| `/dashboard/results` | Results | Presents optical-only, radar-only and combined assessments, Timber-versus-Plaskett comparisons, watershed rankings, charts, spatial findings, limitations and conclusions. |

### Satellite Analysis comparison modes

The Satellite Analysis page has two distinct comparison experiences:

- **Temporal comparison:** A draggable before/after comparison of the same geographical area using pre-fire and post-fire Sentinel-2 observations. The page also provides pre-fire NBR, post-fire NBR and dNBR layers.
- **Cross-sensor comparison:** A side-by-side comparison of Sentinel-2 optical observations and NISAR radar observations over the same study area, with synchronised map navigation where practical, layer controls, legends and opacity controls.

The radar view also provides pre-fire backscatter, post-fire backscatter and radar-change layers, with polarisation choices determined by available product metadata.

### Dashboard interaction requirements

The dashboard uses precomputed datasets and statistics. It does not run heavy satellite processing in the browser. Required interactions include map zoom/navigation, fire selection, Sentinel-2/NISAR layer switching, a before/after slider, watershed selection and detail display, interactive charts and layer visibility controls.

The research dashboard does **not** require login, registration, user profiles, an admin panel or a user-specific database.

---

## Technology stack

The application is built as a React and TypeScript web application.

| Technology | Role |
|---|---|
| React | Component-based user interface |
| TypeScript | Typed application code and data models |
| Vite | Development server and production build |
| Tailwind CSS | Styling and responsive layouts |
| React Router | Public and dashboard routing |
| MapLibre GL JS | Interactive maps and geospatial layers |
| Recharts | Charts and statistical visualisations |
| Zod | Data and form validation where configured |
| Nginx | Production static-file serving in Docker |
| Docker Compose | Cross-platform local deployment |

The project also includes shared map/data services, reusable interface components and automated test configuration. Check `package.json` for the exact installed dependency versions and available scripts.

---

## Data assets and configuration

### Expected project data

The project handover defines the following data outputs. Their presence in a particular checkout should be verified; listing an expected file here does not mean it is already included in the repository.

```text
public/data/
├── big_sur_fire_perimeter.geojson
├── huc12_watersheds.geojson
│
├── Sentinel2/
│   ├── pre_fire_NBR.tif
│   ├── post_fire_NBR.tif
│   ├── dNBR.tif
│   └── fire_area_statistics.csv
│
├── NISAR/
│   ├── pre_fire_backscatter.tif
│   ├── post_fire_backscatter.tif
│   ├── radar_change.tif
│   └── radar_statistics.csv
│
├── Watersheds/
│   └── huc12_watershed_statistics.csv
│
└── Terrain/
    ├── big_sur_dem.tif
    └── big_sur_slope.tif
```

The current project structure includes the fire-perimeter and HUC-12 GeoJSON paths under `public/data/`. Confirm the remaining raster and CSV outputs are supplied and correctly configured before enabling their map layers.

### Raster delivery

Large GeoTIFFs should not be repeatedly downloaded in full by the browser. Serve raster layers through an appropriate tile service or a configured Cloud Optimized GeoTIFF (COG) workflow. MapLibre requires a supported source/layer integration; a raw `.tif` file is not automatically a rendered raster layer merely because its URL is added to the map.

Keep source paths and layer configuration centralised rather than scattering paths through page components. The application currently has a map/data configuration layer under `src/config/` and services under `src/services/`; use the existing implementation as the source of truth.

### Missing or unavailable data

If a required raster, CSV, band or statistic is missing, show an explicit state such as **“Data unavailable”** or **“Awaiting processing.”** Do not substitute unrelated stock photographs, invent values, or silently convert missing measurements to zero.

---

## Run locally

### Prerequisites

- Node.js version compatible with the project (see `package.json` and the lockfile).
- npm.
- Git.

### Clone the repository

```bash
git clone https://github.com/Abankita/project-aetherix.git
cd project-aetherix
```

If you are working from a fork, replace the clone URL with your fork's URL.

### Install dependencies

```bash
npm ci
```

If the repository does not contain a compatible `package-lock.json`, use `npm install` instead.

### Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add the map-provider key required by the configured map service. Do not commit `.env.local`.

### Start the development server

```bash
npm run dev
```

Vite's default development URL is usually:

```text
http://localhost:5173
```

Use the URL printed by Vite if the port is different.

---

## Run with Docker

Docker provides a consistent container-based workflow for Windows, macOS (Apple Silicon and Intel) and Linux, subject to the availability of compatible base images and dependencies.

### Prerequisites

- Docker Desktop on Windows or macOS, or Docker Engine on Linux.
- Docker Compose v2.

### Configure the environment

Create the local environment file:

```bash
cp .env.example .env.local
```

Add the value for the map provider actually enabled by the application. For example:

```env
VITE_CARTO_BASEMAPS_KEY=YOUR_CARTO_KEY
VITE_MAPTILER_API_KEY=
```

Do not copy a CARTO key into the MapTiler variable or vice versa. The configured Docker Compose file and Dockerfile must pass Vite-prefixed public map configuration as build-time arguments, because Vite embeds these values into the frontend build.

### Build and start

```bash
docker compose --env-file .env.local up --build -d
```

Open:

```text
http://localhost:8080
```

Direct dashboard routes should work through the Nginx single-page-application fallback:

```text
http://localhost:8080/dashboard/overview
http://localhost:8080/dashboard/fires
http://localhost:8080/dashboard/satellite
http://localhost:8080/dashboard/watersheds
http://localhost:8080/dashboard/results
```

### View logs

```bash
docker compose logs -f
```

### Stop the application

```bash
docker compose down
```

### Multi-platform image publishing (optional)

To publish a multi-architecture image, use Docker Buildx and a registry to which you have permission to push:

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t YOUR_REGISTRY/after-the-fire:latest \
  --push \
  .
```

Configure any required public build arguments using the repository's Docker build configuration. Do not place private credentials in image build arguments or in the image.

---

## Environment variables

The repository should provide `.env.example` as a template. Create `.env.local` for local values. The exact variables used depend on which integrations are enabled in the application.

| Variable | Purpose | Required for basic precomputed-data display? |
|---|---|---|
| `VITE_CARTO_BASEMAPS_KEY` | CARTO basemap authentication, if CARTO is the configured provider | Required only when using an authenticated CARTO style that requires it |
| `VITE_MAPTILER_API_KEY` | MapTiler basemap styles, if MapTiler is the configured provider | Required only when using MapTiler styles |
| `RESEND_API_KEY` | Server-side email delivery for contact/feedback submissions, if implemented | No |
| `CONTACT_TO_EMAIL` | Destination mailbox for contact/feedback submissions | No |
| `CONTACT_FROM_EMAIL` | Verified sender identity for email delivery | No |
| `COPERNICUS_CLIENT_ID` | Optional server-side Copernicus Data Space authentication for future live data acquisition | No |
| `COPERNICUS_CLIENT_SECRET` | Optional server-side Copernicus Data Space authentication for future live data acquisition | No |
| `EARTHDATA_USERNAME` | Optional protected data-acquisition workflow for NASA Earthdata | No |
| `EARTHDATA_PASSWORD` | Optional protected data-acquisition workflow for NASA Earthdata | No |

**Security notes:**

- Never commit `.env.local` or actual credentials.
- Never expose private server-side secrets through `VITE_` variables.
- Vite-prefixed variables are embedded in client-side assets and must be treated as public configuration. Restrict public map keys to permitted domains where the provider supports it.
- Do not add optional credentials unless the corresponding backend integration is actually implemented.
- Existing precomputed local GeoJSON, CSV and properly served raster assets do not require Copernicus or NASA Earthdata credentials merely to be displayed.

---

## Testing and production build

Check the scripts available in `package.json`:

```bash
npm run
```

Typical project checks, when configured, include:

```bash
npm test
npx tsc --noEmit
npm run build
```

Run the Docker deployment after a successful production build:

```bash
docker compose --env-file .env.local up --build -d
```

Before a release, verify:

- All five dashboard routes load directly.
- Map tiles and attribution load correctly.
- Fire and watershed GeoJSON layers are aligned.
- Missing raster data is reported honestly.
- Temporal and cross-sensor comparison controls work with the available data.
- Map zoom, layer selection and watershed selection work.
- Charts use actual data rather than illustrative values presented as findings.
- Contact/feedback submission status reflects the configured backend.
- Desktop and mobile layouts are usable.

Do not report a test as passed unless it has actually been run.

---

## Team

### TEAM AETHERIX

- **RAJESH KUMAR SWAIN**
  - **Email:** [rajeshkumarswain1976@gmail.com](mailto:rajeshkumarswain1976@gmail.com)
  - **LinkedIn:** [https://www.linkedin.com/in/rajesh-kumar-swain-71243raj/](https://www.linkedin.com/in/rajesh-kumar-swain-71243raj/)

- **ABANKITA BEHERA**
  - **Email:** [abankitabehera05@gmail.com](mailto:abankitabehera05@gmail.com)
  - **LinkedIn:** [https://www.linkedin.com/in/abankita-behera-210836227/](https://www.linkedin.com/in/abankita-behera-210836227/)

---

## Scientific interpretation and limitations

- Positive dNBR is consistent with a decline in NBR and burn-related vegetation or surface change; positive dNBR area is not automatically confirmed burned area.
- Optical and radar observations measure different characteristics and may disagree for scientifically meaningful reasons.
- Radar backscatter change is a surface response and is not, by itself, proof of ecological damage.
- The number and geometry of available pre-fire and post-fire acquisitions may limit interpretation.
- NISAR product version, acquisition geometry, polarisation and processing details should be reported from the actual GCOV metadata.
- Watershed monitoring-priority weights are methodological choices unless independently validated.
- A monitoring-priority score is a relative screening indicator. It is not a validated debris-flow probability or forecast.
- Field validation and suitable outcome data are required before making stronger hazard or impact claims.

---

## Data attribution and software license

Data providers and product versions must be attributed in the application and in research outputs according to the terms applicable to the actual data used. Relevant sources identified in the project handover include:

- **NISAR GCOV:** Alaska Satellite Facility Distributed Active Archive Center (ASF DAAC) / NASA–ISRO mission data, according to the product used.
- **Sentinel-2 Level-2A:** Copernicus Sentinel data.
- **Watershed boundaries:** USGS Watershed Boundary Dataset, HUC-12.
- **Elevation:** USGS SRTM product (`USGS/SRTMGL1_003`) as identified in the current technical handover. Update this attribution if the final processing pipeline uses a different DEM.
- **Fire perimeters:** Original fire perimeter data sourced through ArcGIS; retain the source agency attribution and terms associated with the actual perimeter dataset.
- **Basemaps:** Attribute CARTO, MapTiler, OpenStreetMap or other providers according to the basemap actually configured and used.

The repository includes an MIT license for the software. This does not automatically relicense third-party satellite products, boundaries, basemaps or other external data. Those materials remain subject to their respective provider terms and attribution requirements.

---

## Contributing

Contributions are welcome through focused branches and pull requests.

1. Fork or clone the repository you have permission to use.
2. Create a feature branch:

   ```bash
   git switch -c feat/describe-your-change
   ```

3. Make a focused change and run the relevant tests and production build.
4. Check that no secrets, local environment files, generated build output or unintended large data files are staged:

   ```bash
   git status
   git diff --check
   ```

5. Commit and push your branch:

   ```bash
   git add -A
   git commit -m "feat: describe your change"
   git push -u origin feat/describe-your-change
   ```

6. Open a pull request against the project's `main` branch and describe the change, testing performed and any required data or configuration.

For geospatial changes, include the source dataset, CRS, units, acquisition dates and processing assumptions wherever relevant. Do not submit illustrative values as validated scientific results.

---

**AETHERIX presents AFTER THE FIRE** — a geospatial research platform for exploring post-wildfire landscape change and watershed monitoring priorities in Big Sur, California.
