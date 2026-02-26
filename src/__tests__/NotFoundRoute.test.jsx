import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import '@testing-library/jest-dom';

describe('NotFound route', () => {
  test('renders 404 page for unknown route without full page reload', async () => {
    const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {});

    // Set the browser URL to an unknown path and notify listeners
    window.history.pushState({}, '', '/nonexistent');
    window.dispatchEvent(new PopStateEvent('popstate'));

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const notFound = await screen.findByText(/404\s*[–-]\s*Page Not Found/i);
    expect(notFound).toBeInTheDocument();

    // Ensure no full page reload was attempted
    expect(reloadSpy).not.toHaveBeenCalled();

    // Ensure the address bar reflects the attempted path
    await waitFor(() => {
      expect(window.location.pathname).toBe('/nonexistent');
    });

    reloadSpy.mockRestore();
  });

  test('navigates from root to unknown and back using history', async () => {
    // Start at root
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Navigate to unknown path
    window.history.pushState({}, '', '/some/unknown');
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(await screen.findByText(/404\s*[–-]\s*Page Not Found/i)).toBeInTheDocument();

    // Go back in history
    window.history.back();
    window.dispatchEvent(new PopStateEvent('popstate'));

    // After going back, LoginPage should be present (simple check: presence of Login heading)
    await waitFor(() => {
      expect(screen.getByText(/login/i)).toBeInTheDocument();
    });
  });
});
