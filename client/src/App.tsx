import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  NotFoundPage,
  LabsPage,
  HadafPrototype,
  TrackingDashboard,
  LogProgressPage,
  Prototype2Page,
  Prototype3Page,
  Prototype4Page,
  Prototype5Page,
  Prototype6Page,
  Prototype7Page,
  Prototype8Page,
} from "@/pages";

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

      {/* Redirect root to labs/p1 */}
      <Route path="/">
        {() => {
          window.location.replace("/labs/p1");
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
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
