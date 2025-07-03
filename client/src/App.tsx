import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BuzzerProvider } from "@/context/BuzzerContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Host from "@/pages/host";
import Player from "@/pages/player";
import { useEffect } from "react";

// Debug component to show routing is working
function DebugInfo() {
  useEffect(() => {
    console.log("DebugInfo component mounted - App is rendering");
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.7)', 
      color: 'white',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      BuzzR is loading...
    </div>
  );
}

function Router() {
  useEffect(() => {
    console.log("Router component mounted");
  }, []);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/host" component={Host} />
      <Route path="/player" component={Player} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    console.log("App component mounted");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BuzzerProvider>
          <Toaster />
          <DebugInfo />
          <Router />
        </BuzzerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
