import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import TaskList from "./components/TaskList";
import { TaskFilters } from "./types";
import { LogOut, User } from "lucide-react";
import "./App.css";

const AppContent: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showRegister, setShowRegister] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({});

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return (
      <div className="app-auth-container">
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          style={{ position: "absolute", top: 16, right: 16 }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        {showRegister ? (
          <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn"
        style={{ position: "absolute", top: 16, right: 16, zIndex: 1000 }}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-header-left">
            <h1 className="app-title">TaskTracker</h1>
          </div>

          <div className="app-header-right">
            <div className="app-user-info">
              <User className="app-user-icon" />
              <span>{user?.email}</span>
            </div>
            <button onClick={handleLogout} className="app-logout-button">
              <LogOut className="app-logout-icon" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <TaskList filters={filters} onFiltersChange={setFilters} />
      </main>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
