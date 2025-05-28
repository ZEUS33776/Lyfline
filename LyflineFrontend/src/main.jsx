import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'

// Add error boundary for global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Ensure DOM is ready before initializing React
const initializeApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  try {
    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </StrictMode>
    );
  } catch (error) {
    console.error('Error initializing React app:', error);
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
