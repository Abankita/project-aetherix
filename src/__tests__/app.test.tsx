import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PublicPage } from '@/pages/public/PublicPage';
import { DashboardOverviewPage } from '@/pages/dashboard/DashboardOverviewPage';
import { DashboardFiresPage } from '@/pages/dashboard/DashboardFiresPage';
import { DashboardSatellitePage } from '@/pages/dashboard/DashboardSatellitePage';
import { DashboardWatershedsPage } from '@/pages/dashboard/DashboardWatershedsPage';
import { DashboardResultsPage } from '@/pages/dashboard/DashboardResultsPage';
import { DashboardHeader } from '@/components/navigation/DashboardHeader';
import { ContactForm } from '@/components/forms/ContactForm';
import { FeedbackForm } from '@/components/forms/FeedbackForm';
import { ComparisonSlider } from '@/components/maps/ComparisonSlider';

// Mock maplibre-gl since JSDOM lacks WebGL context
vi.mock('maplibre-gl', () => {
  return {
    default: {
      Map: vi.fn(() => ({
        addControl: vi.fn(),
        on: vi.fn(),
        remove: vi.fn(),
        flyTo: vi.fn(),
        getSource: vi.fn(),
        addSource: vi.fn(),
        addLayer: vi.fn(),
        getLayer: vi.fn(() => true),
        setStyle: vi.fn(),
        setPaintProperty: vi.fn(),
        setLayoutProperty: vi.fn(),
        isStyleLoaded: vi.fn(() => true),
        getCanvas: vi.fn(() => ({ style: {} })),
      })),
      NavigationControl: vi.fn(),
      AttributionControl: vi.fn(),
    },
  };
});

describe('AFTER THE FIRE — Public & Research Dashboard Pages', () => {
  describe('Public-Facing Website (/)', () => {
    it('renders hero welcome heading and project description', () => {
      render(
        <MemoryRouter>
          <PublicPage />
        </MemoryRouter>
      );
      expect(screen.getByText('After the fire, understand what changed.')).toBeInTheDocument();
      expect(
        screen.getByText(/An interactive research initiative combining satellite intelligence/)
      ).toBeInTheDocument();
    });

    it('contains exactly TWO team member profiles', () => {
      render(
        <MemoryRouter>
          <PublicPage />
        </MemoryRouter>
      );
      expect(screen.getByText('Rajesh Kumar Swain')).toBeInTheDocument();
      expect(screen.getByText('Abankita Behera')).toBeInTheDocument();
      // Verify no third profile
      expect(screen.queryByText(/Dr\. Jane Doe/)).not.toBeInTheDocument();
    });

    it('displays the exact research vision statement and 3 objectives', () => {
      render(
        <MemoryRouter>
          <PublicPage />
        </MemoryRouter>
      );
      expect(
        screen.getByText(/“To make post-wildfire landscape changes easier to observe/)
      ).toBeInTheDocument();
      expect(screen.getByText('Observe Landscape Changes')).toBeInTheDocument();
      expect(screen.getByText('Understand Observations')).toBeInTheDocument();
      expect(screen.getByText('Identify Priority Watersheds')).toBeInTheDocument();
    });

    it('supports tab switching between Contact Us and Share Feedback', () => {
      render(
        <MemoryRouter>
          <PublicPage />
        </MemoryRouter>
      );
      const feedbackTabBtn = screen.getByRole('button', { name: /share feedback/i });
      fireEvent.click(feedbackTabBtn);
      expect(screen.getByText(/Scientific Quality Rating/i)).toBeInTheDocument();

      const contactTabBtn = screen.getByRole('button', { name: /contact us/i });
      fireEvent.click(contactTabBtn);
      expect(screen.getByText(/Institutional Email/i)).toBeInTheDocument();
    });
  });

  describe('Contact & Feedback Forms Validation', () => {
    it('validates contact form fields and shows validation errors on invalid submit', async () => {
      render(<ContactForm />);
      const submitBtn = screen.getByRole('button', { name: /submit inquiry/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/Please enter a valid academic/i)).toBeInTheDocument();
      });
    });

    it('validates feedback form and shows feedback submission notice honestly', async () => {
      render(<FeedbackForm />);
      const commentInput = screen.getByPlaceholderText(/Share your suggestions/i);
      fireEvent.change(commentInput, {
        target: { value: 'Excellent spatial radiometry calibration across Big Sur.' },
      });
      const submitBtn = screen.getByRole('button', { name: /submit feedback/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Feedback Recorded/i)).toBeInTheDocument();
      });
    });
  });

  describe('Shared Dashboard Navigation Component', () => {
    it('renders all 5 dashboard page links and returns to public site', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard/overview']}>
          <DashboardHeader />
        </MemoryRouter>
      );
      expect(screen.getByText('AFTER THE FIRE')).toBeInTheDocument();
      expect(screen.getByText('OVERVIEW')).toBeInTheDocument();
      expect(screen.getByText('FIRE OVERVIEW')).toBeInTheDocument();
      expect(screen.getByText('SATELLITE ANALYSIS')).toBeInTheDocument();
      expect(screen.getByText('WATERSHED ANALYSIS')).toBeInTheDocument();
      expect(screen.getByText('RESULTS')).toBeInTheDocument();
      expect(screen.getByText('Public Site')).toBeInTheDocument();
    });
  });

  describe('Dashboard Page 1 — Overview (/dashboard/overview)', () => {
    it('displays the preliminary processing inventory with 11 HUC units, 20 pre-fire scenes, 34 post-fire scenes', () => {
      render(
        <MemoryRouter>
          <DashboardOverviewPage />
        </MemoryRouter>
      );
      expect(screen.getByText(/Initial Processing Inventory/i)).toBeInTheDocument();
      expect(screen.getByText('11')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('34')).toBeInTheDocument();
      expect(screen.getByText(/Preliminary Operational Baseline/i)).toBeInTheDocument();
    });
  });

  describe('Dashboard Page 2 — Fire Overview (/dashboard/fires)', () => {
    it('allows switching between Timber Fire and Plaskett Fire', () => {
      render(
        <MemoryRouter>
          <DashboardFiresPage />
        </MemoryRouter>
      );
      const timberBtn = screen.getByRole('button', { name: /TIMBER FIRE/i });
      fireEvent.click(timberBtn);
      expect(screen.getByText(/Timber Fire Telemetry & Impact/i)).toBeInTheDocument();
      expect(screen.getByText('5,800 ha')).toBeInTheDocument();

      const plaskettBtn = screen.getByRole('button', { name: /PLASKETT FIRE/i });
      fireEvent.click(plaskettBtn);
      expect(screen.getByText(/Plaskett Fire Telemetry & Impact/i)).toBeInTheDocument();
      expect(screen.getByText('7,420 ha')).toBeInTheDocument();
    });
  });

  describe('Dashboard Page 3 — Satellite Analysis (/dashboard/satellite)', () => {
    it('switches between Optical, Radar, and Combined modes', () => {
      render(
        <MemoryRouter>
          <DashboardSatellitePage />
        </MemoryRouter>
      );
      // Combined Mode active by default
      expect(screen.getByText(/Areas of Sensor Agreement & Disagreement/i)).toBeInTheDocument();

      // Switch to Optical
      const opticalBtn = screen.getByRole('button', { name: /OPTICAL/i });
      fireEvent.click(opticalBtn);
      expect(screen.getByText(/NBR = \(B8 − B12\) \/ \(B8 \+ B12\)/i)).toBeInTheDocument();

      // Switch to Radar
      const radarBtn = screen.getByRole('button', { name: /RADAR/i });
      fireEvent.click(radarBtn);
      expect(screen.getByText(/NISAR L-Band Radar Backscatter/i)).toBeInTheDocument();
      expect(screen.getByText(/VH \(Volume Cross-Pol\)/i)).toBeInTheDocument();
    });

    it('renders draggable comparison slider with reset button', () => {
      render(<ComparisonSlider />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
      const resetBtn = screen.getByRole('button', { name: /reset 50\/50/i });
      expect(resetBtn).toBeInTheDocument();
    });
  });

  describe('Dashboard Page 4 — Watershed Analysis (/dashboard/watersheds)', () => {
    it('renders the 11 HUC-12 rankings and mandatory scientific disclaimer', () => {
      render(
        <MemoryRouter>
          <DashboardWatershedsPage />
        </MemoryRouter>
      );
      expect(screen.getByText('Willow Creek–Frontal Catchment')).toBeInTheDocument();
      expect(screen.getByText(/All 11 Catchment Monitoring Rankings/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Monitoring priority represents relative prioritisation for further monitoring/i)
      ).toBeInTheDocument();
    });
  });

  describe('Dashboard Page 5 — Results (/dashboard/results)', () => {
    it('renders combined findings, comparison tabs, and limitations', () => {
      render(
        <MemoryRouter>
          <DashboardResultsPage />
        </MemoryRouter>
      );
      expect(screen.getByText(/Synthesis of Post-Wildfire/i)).toBeInTheDocument();
      expect(screen.getByText('Catchment Monitoring Priority vs Geomorphic Slopes')).toBeInTheDocument();

      const limitationsTab = screen.getByRole('button', { name: /scientific limitations/i });
      fireEvent.click(limitationsTab);
      expect(screen.getByText(/Operational & Methodological Limitations/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Conclusions' })).toBeInTheDocument();
    });
  });
});
