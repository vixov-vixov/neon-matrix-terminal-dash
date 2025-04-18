
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Application states
export enum AppState {
  LOGIN = 'login',
  BOOT_SEQUENCE = 'boot_sequence',
  DASHBOARD = 'dashboard',
  COMMAND_CONSOLE = 'command_console',
  ACCOUNTS_TABLE = 'accounts_table',
}

// Account data structure
export interface Account {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
}

// App state structure
interface AppContextState {
  currentState: AppState;
  username: string;
  isAuthenticated: boolean;
  isMatrixRainActive: boolean;
  accounts: Account[];
  commandHistory: string[];
  lastCommand: string;
  soundEnabled: boolean;
  isDeveloperMode: boolean;
  inactivityTimer: number | null;
}

// Action types
type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'TOGGLE_MATRIX_RAIN' }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'ADD_COMMAND'; payload: string }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_DEVELOPER_MODE' }
  | { type: 'RESET_INACTIVITY_TIMER'; payload: number | null }
  | { type: 'LOAD_ACCOUNTS' };

// Initial state
const initialState: AppContextState = {
  currentState: AppState.LOGIN,
  username: '',
  isAuthenticated: false,
  isMatrixRainActive: false,
  accounts: [],
  commandHistory: [],
  lastCommand: '',
  soundEnabled: true,
  isDeveloperMode: false,
  inactivityTimer: null,
};

// Reducer
const appReducer = (state: AppContextState, action: Action): AppContextState => {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, currentState: action.payload };
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'TOGGLE_MATRIX_RAIN':
      return { ...state, isMatrixRainActive: !state.isMatrixRainActive };
    case 'ADD_ACCOUNT':
      const newAccounts = [...state.accounts, action.payload];
      localStorage.setItem('hackerAppAccounts', JSON.stringify(newAccounts));
      return { ...state, accounts: newAccounts };
    case 'UPDATE_ACCOUNT':
      const updatedAccounts = state.accounts.map(account => 
        account.id === action.payload.id ? action.payload : account
      );
      localStorage.setItem('hackerAppAccounts', JSON.stringify(updatedAccounts));
      return { ...state, accounts: updatedAccounts };
    case 'DELETE_ACCOUNT':
      const filteredAccounts = state.accounts.filter(account => account.id !== action.payload);
      localStorage.setItem('hackerAppAccounts', JSON.stringify(filteredAccounts));
      return { ...state, accounts: filteredAccounts };
    case 'ADD_COMMAND':
      return { 
        ...state, 
        commandHistory: [...state.commandHistory, action.payload],
        lastCommand: action.payload,
      };
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    case 'TOGGLE_DEVELOPER_MODE':
      return { ...state, isDeveloperMode: !state.isDeveloperMode };
    case 'RESET_INACTIVITY_TIMER':
      return { ...state, inactivityTimer: action.payload };
    case 'LOAD_ACCOUNTS':
      const savedAccounts = localStorage.getItem('hackerAppAccounts');
      return { 
        ...state, 
        accounts: savedAccounts ? JSON.parse(savedAccounts) : [] 
      };
    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppContextState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load accounts from localStorage on initial render
  useEffect(() => {
    dispatch({ type: 'LOAD_ACCOUNTS' });
  }, []);

  // Set up inactivity timer
  useEffect(() => {
    const resetTimer = () => {
      if (state.inactivityTimer) {
        clearTimeout(state.inactivityTimer);
      }

      if (state.isAuthenticated) {
        const timer = window.setTimeout(() => {
          dispatch({ type: 'SET_STATE', payload: AppState.LOGIN });
          dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        }, 3 * 60 * 1000); // 3 minutes
        dispatch({ type: 'RESET_INACTIVITY_TIMER', payload: timer as unknown as number });
      }
    };

    // Set up event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      if (state.inactivityTimer) {
        clearTimeout(state.inactivityTimer);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [state.isAuthenticated, state.inactivityTimer]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the app context
export const useAppContext = () => useContext(AppContext);
