import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/index";
import Representatives from "@/pages/representatives";
import Issues from "@/pages/issues";
import Petitions from "@/pages/petitions";
import Messages from "@/pages/messages";
import Accountability from "@/pages/accountability";
import Spotlight from "@/pages/spotlight";
import About from "@/pages/about";
import Scorecard from "@/pages/scorecard";
import OnRecord from "@/pages/on-record";
import DataSources from "@/pages/data-sources";
import FindReps from "@/pages/find-reps";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/representatives" component={Representatives} />
      <Route path="/issues" component={Issues} />
      <Route path="/petitions" component={Petitions} />
      <Route path="/messages" component={Messages} />
      <Route path="/accountability" component={Accountability} />
      <Route path="/spotlight" component={Spotlight} />
      <Route path="/scorecard" component={Scorecard} />
      <Route path="/on-record" component={OnRecord} />
      <Route path="/about" component={About} />
      <Route path="/data-sources" component={DataSources} />
      <Route path="/find-reps" component={FindReps} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
