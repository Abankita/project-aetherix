import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingFallback } from '@/components/ui/LoadingFallback';

// Lazy-loaded routes for performance & code-splitting
const PublicPage = lazy(() =>
  import('@/pages/public/PublicPage').then((m) => ({ default: m.PublicPage }))
);
const DashboardOverviewPage = lazy(() =>
  import('@/pages/dashboard/DashboardOverviewPage').then((m) => ({
    default: m.DashboardOverviewPage,
  }))
);
const DashboardFiresPage = lazy(() =>
  import('@/pages/dashboard/DashboardFiresPage').then((m) => ({
    default: m.DashboardFiresPage,
  }))
);
const DashboardSatellitePage = lazy(() =>
  import('@/pages/dashboard/DashboardSatellitePage').then((m) => ({
    default: m.DashboardSatellitePage,
  }))
);
const DashboardWatershedsPage = lazy(() =>
  import('@/pages/dashboard/DashboardWatershedsPage').then((m) => ({
    default: m.DashboardWatershedsPage,
  }))
);
const DashboardResultsPage = lazy(() =>
  import('@/pages/dashboard/DashboardResultsPage').then((m) => ({
    default: m.DashboardResultsPage,
  }))
);

export const router = createBrowserRouter([
  // Public continuous scrolling page
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PublicPage />
          </Suspense>
        ),
      },
    ],
  },
  // Research Dashboard (Shared Top-Nav, Exactly 5 routes)
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/overview" replace />,
      },
      {
        path: 'overview',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <DashboardOverviewPage />
          </Suspense>
        ),
      },
      {
        path: 'fires',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <DashboardFiresPage />
          </Suspense>
        ),
      },
      {
        path: 'satellite',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <DashboardSatellitePage />
          </Suspense>
        ),
      },
      {
        path: 'watersheds',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <DashboardWatershedsPage />
          </Suspense>
        ),
      },
      {
        path: 'results',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <DashboardResultsPage />
          </Suspense>
        ),
      },
    ],
  },
  // Catch-all
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
