import React from 'react';
import { User, Lock, AlertTriangle } from 'lucide-react';

interface LoginViewProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  authError: string;
  authLoading: boolean;
  handleLogin: (e: React.FormEvent) => void;
  isMockMode: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  authError,
  authLoading,
  handleLogin,
  isMockMode,
}) => {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src="/logo.jpg" alt="SEF_Logo" style={{ width: '120px', height: '120px'}} />
        </div>
        <h2 className="login-title">SEF_Aftkad_App</h2>
        <p className="login-subtitle">Sign in to manage attendees, events, and track attendance</p>

        {isMockMode && (
          <div className="alert-banner alert-banner-warning">
            <AlertTriangle size={20} />
            <span>Offline Mock Mode enabled. Any credentials will work.</span>
          </div>
        )}

        {authError && (
          <div className="alert-banner alert-banner-danger" style={{ color: 'var(--danger)', border: '1px solid var(--danger)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
            <AlertTriangle size={20} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                id="email"
                type="email" 
                className="form-control" 
                style={{ paddingLeft: '40px' }}
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                id="password"
                type="password" 
                className="form-control" 
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px' }}
            disabled={authLoading}
          >
            {authLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
