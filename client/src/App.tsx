import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";

// Lazy load all pages for code splitting
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const LabsPage = lazy(() => import("@/features/labs/pages/LabsPage"));
const HadafPrototype = lazy(() => import("@/features/prototype1/pages/HadafPrototype"));
const TrackingDashboard = lazy(() => import("@/features/prototype1/pages/TrackingDashboard"));
const LogProgressPage = lazy(() => import("@/features/prototype1/pages/LogProgressPage"));
const Prototype2Page = lazy(() => import("@/features/prototype2/pages/Prototype2Page"));
const Prototype3Page = lazy(() => import("@/features/prototype3/pages/Prototype3Page"));
const Prototype4Page = lazy(() => import("@/features/prototype4/pages/Prototype4Page"));
const Prototype5Page = lazy(() => import("@/features/prototype5/pages/Prototype5Page"));
const Prototype6Page = lazy(() => import("@/features/prototype6/pages/Prototype6Page"));
const Prototype7Page = lazy(() => import("@/features/prototype7/pages/Prototype7Page"));
const Prototype8Page = lazy(() => import("@/features/prototype8/pages/Prototype8Page"));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-lg text-muted-foreground">Loading...</div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Labs routes - must come before root redirect */}
      <Route path="/labs" component={LabsPage} />
      <Route path="/labs/p1" component={HadafPrototype} />
      <Route path="/labs/p1/dashboard" component={TrackingDashboard} />
      <Route path="/labs/p1/log" component={LogProgressPage} />
      <Route path="/labs/p2" component={Prototype2Page} />
      <Route path="/labs/p3" component={Prototype3Page} />
      <Route path="/labs/p4" component={Prototype4Page} />
      <Route path="/labs/p5" component={Prototype5Page} />
      <Route path="/labs/p6" component={Prototype6Page} />
      <Route path="/labs/p7" component={Prototype7Page} />
      <Route path="/labs/p8" component={Prototype8Page} />

      {/* Prototype 2 with Dashboard system */}
      <Route path="/labs/p2/:tab?" component={Prototype2Page} />

      {/* Redirect root to labs */}
      <Route path="/">
        {() => {
          window.location.replace("/labs/");
          return null;
        }}
      </Route>

      {/* 404 */}
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Suspense fallback={<PageLoader />}>
          <Router />
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
