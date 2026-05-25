import {
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import React from "react";
import { Suspense, lazy } from "react";
import { Toaster } from "sonner";
import { AppProvider, useApp } from "./AppContext";
import { Layout } from "./components/Layout";
import { AccessValidationProvider } from "./stores/accessValidationStore";

import { FilterProvider } from "@/contexts/FilterContext";
import { ForgeAIChatProvider } from "./contexts/ForgeAIChatContext";
import { useTheme } from "./hooks/useTheme";
import { DistributorSetupPage } from "./pages/DistributorSetupPage";
import { EnterpriseCalculatorPage } from "./pages/EnterpriseCalculatorPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
// Eagerly load landing & onboarding (no Layout)
import { LoginPage } from "./pages/LoginPage";
import { MFAChallengePage } from "./pages/MFAChallengePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { PricingPage } from "./pages/PricingPage";
import { ResellerSetupPage } from "./pages/ResellerSetupPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SovereignInfrastructurePage } from "./pages/SovereignInfrastructurePage";
import { SubscriptionOnboarding } from "./pages/SubscriptionOnboarding";
import { UnifiedLoginPage } from "./pages/UnifiedLoginPage";
import { WorkspaceSetupPage } from "./pages/WorkspaceSetupPage";

// Lazy load all app pages
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const AccountsList = lazy(() =>
  import("./pages/AccountsList").then((m) => ({ default: m.AccountsList })),
);
const AccountRecord = lazy(() =>
  import("./pages/AccountRecord").then((m) => ({ default: m.AccountRecord })),
);
const DealRegistrations = lazy(() =>
  import("./pages/DealRegistrations").then((m) => ({
    default: m.DealRegistrations,
  })),
);
const Renewals = lazy(() =>
  import("./pages/Renewals").then((m) => ({ default: m.Renewals })),
);
const Reports = lazy(() =>
  import("./pages/Reports").then((m) => ({ default: m.Reports })),
);
const Tasks = lazy(() => import("./pages/Tasks"));
const BusinessPlans = lazy(() =>
  import("./pages/BusinessPlans").then((m) => ({ default: m.BusinessPlans })),
);
const Promotions = lazy(() =>
  import("./pages/Promotions").then((m) => ({ default: m.Promotions })),
);
const PriceLists = lazy(() =>
  import("./pages/PriceLists").then((m) => ({ default: m.PriceLists })),
);
const LatestNews = lazy(() =>
  import("./pages/LatestNews").then((m) => ({ default: m.LatestNews })),
);
const Alerts = lazy(() =>
  import("./pages/Alerts").then((m) => ({ default: m.Alerts })),
);
const ResellerPartnerView = lazy(() =>
  import("./pages/ResellerPartnerView").then((m) => ({
    default: m.ResellerPartnerView,
  })),
);

const AdminSettings = lazy(() =>
  import("./pages/AdminSettings").then((m) => ({ default: m.AdminSettings })),
);
const DistributorAdminSettings = lazy(() =>
  import("./pages/DistributorAdminSettings").then((m) => ({
    default: m.DistributorAdminSettings,
  })),
);
const ResellerAdminSettings = lazy(() =>
  import("./pages/ResellerAdminSettings").then((m) => ({
    default: m.ResellerAdminSettings,
  })),
);
const TheFoundry = lazy(() =>
  import("./pages/TheFoundry").then((m) => ({ default: m.TheFoundry })),
);
const FoundryLite = lazy(() => import("./pages/FoundryLite"));
const PartnerTiers = lazy(() =>
  import("./pages/PartnerTiers").then((m) => ({ default: m.PartnerTiers })),
);
const NotificationCenter = lazy(() =>
  import("./pages/NotificationCenter").then((m) => ({
    default: m.NotificationCenter,
  })),
);
const QTDDashboard = lazy(() =>
  import("./pages/QTDDashboard").then((m) => ({ default: m.QTDDashboard })),
);
const QuarterSetupPage = lazy(() =>
  import("./pages/QuarterSetupPage").then((m) => ({
    default: m.QuarterSetupPage,
  })),
);
const TargetMeasuresPage = lazy(() =>
  import("./pages/TargetMeasuresPage").then((m) => ({
    default: m.TargetMeasuresPage,
  })),
);
const AuditLogDashboard = lazy(() =>
  import("./pages/AuditLogDashboard").then((m) => ({
    default: m.AuditLogDashboard,
  })),
);
const DistributorWorkspaceView = lazy(() =>
  import("./pages/DistributorWorkspaceView").then((m) => ({
    default: m.DistributorWorkspaceView,
  })),
);
const MessagingPage = lazy(() =>
  import("./pages/MessagingPage").then((m) => ({ default: m.MessagingPage })),
);
const ForgeAIPage = lazy(() =>
  import("./pages/ForgeAIPage").then((m) => ({ default: m.ForgeAIPage })),
);
const UserProfilePage = lazy(() =>
  import("./pages/UserProfilePage").then((m) => ({
    default: m.UserProfilePage,
  })),
);
const OpportunitiesPage = lazy(() =>
  import("./pages/OpportunitiesPage").then((m) => ({
    default: m.OpportunitiesPage,
  })),
);
const OpportunityRecord = lazy(() =>
  import("./pages/OpportunityRecord").then((m) => ({
    default: m.OpportunityRecord,
  })),
);
const MdfRequestsPage = lazy(() =>
  import("./pages/MdfRequestsPage").then((m) => ({
    default: m.MdfRequestsPage,
  })),
);
const MdfRequestRecord = lazy(() =>
  import("./pages/MdfRequestRecord").then((m) => ({
    default: m.MdfRequestRecord,
  })),
);
const MarketingActivitiesPage = lazy(() =>
  import("./pages/MarketingActivitiesPage").then((m) => ({
    default: m.MarketingActivitiesPage,
  })),
);
const MarketingActivityRecord = lazy(() =>
  import("./pages/MarketingActivityRecord").then((m) => ({
    default: m.MarketingActivityRecord,
  })),
);
const QuotesPage = lazy(() =>
  import("./pages/QuotesPage").then((m) => ({ default: m.QuotesPage })),
);
const YoYGrowthPage = lazy(() =>
  import("./pages/YoYGrowthPage").then((m) => ({ default: m.YoYGrowthPage })),
);
const LinkedWorkspacesPage = lazy(() =>
  import("./pages/LinkedWorkspacesPage").then((m) => ({
    default: m.LinkedWorkspacesPage,
  })),
);

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AuthLoadingGate({ children }: { children: React.ReactNode }) {
  const { loading } = useApp();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
}

function AppShell({ children }: { children: React.ReactNode }) {
  const { effectiveTheme } = useTheme();
  // Auth is enforced exclusively by requireAuth() in each route's beforeLoad.
  // A duplicate token check here would show a blank blue screen on first load
  // before the router's redirect resolves, so we do NOT guard here.
  return (
    <ForgeAIChatProvider>
      <AuthLoadingGate>
        <Layout>
          <Suspense fallback={<PageLoader />}>{children}</Suspense>
        </Layout>
        <Toaster position="bottom-right" theme={effectiveTheme} richColors />
      </AuthLoadingGate>
    </ForgeAIChatProvider>
  );
}

function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="bottom-right" theme="dark" richColors />
    </>
  );
}

// ─── Auth helper ───────────────────────────────────────────────────────────
// Called in beforeLoad of every protected route. Throws a redirect to /login
// if no session token is found in either storage layer.
function requireAuth() {
  const token =
    sessionStorage.getItem("cf_session_token") ||
    localStorage.getItem("cf_session_token");
  if (!token) {
    throw redirect({ to: "/login" });
  }
}

// Routes
const rootRoute = createRootRoute();

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/landing",
  beforeLoad: () => {
    // /landing is deprecated — all public landing content now lives on /login (UnifiedLoginPage)
    throw redirect({ to: "/login" });
  },
  component: () => null,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: () => (
    <PublicShell>
      <OnboardingPage />
    </PublicShell>
  ),
});

const resellerSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reseller-setup",
  component: () => (
    <PublicShell>
      <ResellerSetupPage />
    </PublicShell>
  ),
});

// /login — primary public entry point
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: () => {
    // If already authenticated, skip login and go straight to dashboard
    const token =
      sessionStorage.getItem("cf_session_token") ||
      localStorage.getItem("cf_session_token");
    if (token) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: () => (
    <PublicShell>
      <UnifiedLoginPage />
    </PublicShell>
  ),
});

// Root '/' — unauthenticated → /login, authenticated → /dashboard (fires before any render)
const rootIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    const token =
      sessionStorage.getItem("cf_session_token") ||
      localStorage.getItem("cf_session_token");
    if (!token) {
      throw redirect({ to: "/login" });
    }
    throw redirect({ to: "/dashboard" });
  },
  component: () => null,
});

// /dashboard — authenticated dashboard
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

const accountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/accounts",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <AccountsList />
    </AppShell>
  ),
});

const accountRecordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/accounts/$id",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <AccountRecord />
    </AppShell>
  ),
});

const contactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contacts",
  beforeLoad: () => {
    requireAuth();
    throw redirect({ to: "/messages" });
  },
  component: () => null,
});

const contactRecordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contacts/$id",
  beforeLoad: () => {
    requireAuth();
    throw redirect({ to: "/messages" });
  },
  component: () => null,
});

const dealRegsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deal-registrations",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <DealRegistrations />
    </AppShell>
  ),
});

const renewalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/renewals",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <Renewals />
    </AppShell>
  ),
});

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tasks",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <Tasks />
    </AppShell>
  ),
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <Reports />
    </AppShell>
  ),
});

const businessPlansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-plans",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <BusinessPlans />
    </AppShell>
  ),
});

const promotionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/promotions",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <Promotions />
    </AppShell>
  ),
});

const priceListsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/price-lists",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <PriceLists />
    </AppShell>
  ),
});

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/news",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <LatestNews />
    </AppShell>
  ),
});

const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alerts",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <Alerts />
    </AppShell>
  ),
});

const resellerViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reseller/$id",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <ResellerPartnerView />
    </AppShell>
  ),
});

const foundryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/foundry",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <TheFoundry />
    </AppShell>
  ),
});

const foundryLiteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/foundry-lite",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <Suspense fallback={<PageLoader />}>
        <FoundryLite />
      </Suspense>
    </AppShell>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <AdminSettings />
    </AppShell>
  ),
});

const distributorAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/distributor-admin",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <DistributorAdminSettings />
    </AppShell>
  ),
});

const resellerAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reseller-admin",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <ResellerAdminSettings />
    </AppShell>
  ),
});

const adminTiersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/tiers",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <PartnerTiers />
    </AppShell>
  ),
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <NotificationCenter />
    </AppShell>
  ),
});

const qtdDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports/qtd",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <QTDDashboard />
    </AppShell>
  ),
});

const quarterSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/quarter-setup",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <QuarterSetupPage />
    </AppShell>
  ),
});

const targetMeasuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/targets",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <TargetMeasuresPage />
    </AppShell>
  ),
});
const auditLogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/audit-log",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <AuditLogDashboard />
    </AppShell>
  ),
});

const distributorSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/distributor-setup",
  component: () => (
    <PublicShell>
      <DistributorSetupPage />
    </PublicShell>
  ),
});

const distributorWorkspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/distributor/$id",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <DistributorWorkspaceView />
    </AppShell>
  ),
});

const forgeAIRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forge-ai",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <ForgeAIPage />
    </AppShell>
  ),
});

const messagingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <MessagingPage />
    </AppShell>
  ),
});

const messagingConversationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages/$conversationId",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <MessagingPage />
    </AppShell>
  ),
});

const userProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$userId",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <UserProfilePage />
    </AppShell>
  ),
});

const opportunitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/opportunities",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <OpportunitiesPage />
    </AppShell>
  ),
});

const opportunityRecordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/opportunities/$id",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <OpportunityRecord />
    </AppShell>
  ),
});

const mdfRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mdf-requests",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <MdfRequestsPage />
    </AppShell>
  ),
});

const mdfRequestRecordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mdf-requests/$id",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <MdfRequestRecord />
    </AppShell>
  ),
});

const marketingActivitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketing-activities",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <MarketingActivitiesPage />
    </AppShell>
  ),
});

const marketingActivityRecordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketing-activities/$id",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <MarketingActivityRecord />
    </AppShell>
  ),
});
const quotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quotes",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <QuotesPage />
    </AppShell>
  ),
});

const linkedWorkspacesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/linked-workspaces",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <LinkedWorkspacesPage />
    </AppShell>
  ),
});

const yoyGrowthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/yoy-growth",
  beforeLoad: () => requireAuth(),
  component: () => (
    <AppShell>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <YoYGrowthPage />
      </Suspense>
    </AppShell>
  ),
});

const workspaceSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workspace-setup",
  component: () => (
    <PublicShell>
      <WorkspaceSetupPage />
    </PublicShell>
  ),
});

const vendorLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vendor-login",
  beforeLoad: () => {
    const token =
      sessionStorage.getItem("cf_session_token") ||
      localStorage.getItem("cf_session_token");
    if (token) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: () => (
    <PublicShell>
      <LoginPage loginRole="Vendor" />
    </PublicShell>
  ),
});

const distributorLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/distributor-login",
  beforeLoad: () => {
    const token =
      sessionStorage.getItem("cf_session_token") ||
      localStorage.getItem("cf_session_token");
    if (token) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: () => (
    <PublicShell>
      <LoginPage loginRole="Distributor" />
    </PublicShell>
  ),
});

const resellerLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reseller-login",
  beforeLoad: () => {
    const token =
      sessionStorage.getItem("cf_session_token") ||
      localStorage.getItem("cf_session_token");
    if (token) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: () => (
    <PublicShell>
      <LoginPage loginRole="Reseller" />
    </PublicShell>
  ),
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: () => (
    <PublicShell>
      <ForgotPasswordPage />
    </PublicShell>
  ),
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: () => (
    <PublicShell>
      <ResetPasswordPage />
    </PublicShell>
  ),
});

const mfaChallengeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mfa-challenge",
  component: () => (
    <PublicShell>
      <MFAChallengePage />
    </PublicShell>
  ),
});
const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pricing",
  component: () => (
    <PublicShell>
      <PricingPage />
    </PublicShell>
  ),
});
const enterpriseCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/enterprise-calculator",
  component: () => (
    <PublicShell>
      <EnterpriseCalculatorPage />
    </PublicShell>
  ),
});
const sovereignInfrastructureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sovereign-infrastructure",
  component: () => (
    <PublicShell>
      <SovereignInfrastructurePage />
    </PublicShell>
  ),
});

const subscriptionOnboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subscription-onboarding",
  component: () => (
    <PublicShell>
      <SubscriptionOnboarding />
    </PublicShell>
  ),
});

const routeTree = rootRoute.addChildren([
  rootIndexRoute,
  loginRoute,
  landingRoute,
  onboardingRoute,
  resellerSetupRoute,
  distributorSetupRoute,
  dashboardRoute,
  accountsRoute,
  accountRecordRoute,
  contactsRoute,
  contactRecordRoute,
  dealRegsRoute,
  renewalsRoute,
  tasksRoute,
  reportsRoute,
  businessPlansRoute,
  promotionsRoute,
  priceListsRoute,
  newsRoute,
  alertsRoute,
  foundryRoute,
  foundryLiteRoute,
  adminRoute,
  distributorAdminRoute,
  resellerAdminRoute,
  adminTiersRoute,
  resellerViewRoute,
  notificationsRoute,
  qtdDashboardRoute,
  quarterSetupRoute,
  targetMeasuresRoute,
  auditLogRoute,
  distributorWorkspaceRoute,
  forgeAIRoute,
  messagingRoute,
  messagingConversationRoute,
  userProfileRoute,
  opportunitiesRoute,
  opportunityRecordRoute,
  mdfRequestsRoute,
  mdfRequestRecordRoute,
  marketingActivitiesRoute,
  marketingActivityRecordRoute,
  quotesRoute,
  linkedWorkspacesRoute,
  yoyGrowthRoute,
  workspaceSetupRoute,
  pricingRoute,
  enterpriseCalculatorRoute,
  sovereignInfrastructureRoute,
  subscriptionOnboardingRoute,
  vendorLoginRoute,
  distributorLoginRoute,
  resellerLoginRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  mfaChallengeRoute,
]);

const hashHistory = createHashHistory();

const router = createRouter({
  routeTree,
  history: hashHistory,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[CHANNELFORGE ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060d18] flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h2 className="text-2xl font-bold text-orange-400 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-400 mb-6">
              CHANNELFORGE encountered an unexpected error.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
            >
              Reload Platform
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <FilterProvider>
          <AccessValidationProvider>
            <RouterProvider router={router} />
          </AccessValidationProvider>
        </FilterProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
