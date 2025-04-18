
import React, { useEffect } from 'react';
import { useAppContext, AppState, AppProvider } from '../context/AppContext';
import Login from '../components/Login';
import BootSequence from '../components/BootSequence';
import Dashboard from '../components/Dashboard';
import CommandConsole from '../components/CommandConsole';
import AccountsTable from '../components/AccountsTable';
import CommandPalette from '../components/CommandPalette';

// Content component that displays the current app state
const Content: React.FC = () => {
  const { state } = useAppContext();
  
  // Render the appropriate component based on current state
  switch (state.currentState) {
    case AppState.LOGIN:
      return <Login />;
    case AppState.BOOT_SEQUENCE:
      return <BootSequence />;
    case AppState.DASHBOARD:
      return <Dashboard />;
    case AppState.COMMAND_CONSOLE:
      return <CommandConsole />;
    case AppState.ACCOUNTS_TABLE:
      return <AccountsTable />;
    default:
      return <Login />;
  }
};

// Main app container
const Index: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-hacker-dark text-white overflow-hidden">
        <Content />
        <CommandPalette />
      </div>
    </AppProvider>
  );
};

export default Index;
