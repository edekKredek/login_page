import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import '@testing-library/jest-dom';

describe('Navigation suite', () => {
  let reloadSpy;

  beforeEach(() => {
    reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {});
  });

  afterEach(() => {
    reloadSpy.mockRestore();
  });

  test('Navigation flow: login -> success without reload', async () => {
    // Start at login
    window.history.pushState({}, '', '/');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const user = userEvent.setup();
    const loginButton = await screen.findByRole('button', { name: /login/i });

    await user.click(loginButton);

    await waitFor(() => expect(screen.getByText(/success/i)).toBeInTheDocument());
    expect(reloadSpy).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/success');
  });

  test('Back button/history.goBack returns to login without reload', async () => {
    // Start at login
    window.history.pushState({}, '', '/');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const user = userEvent.setup();
    const loginButton = await screen.findByRole('button', { name: /login/i });
    await user.click(loginButton);
    await waitFor(() => expect(screen.getByText(/success/i)).toBeInTheDocument());

    // Simulate browser back
    window.history.back();
    window.dispatchEvent(new PopStateEvent('popstate'));

    await waitFor(() => expect(screen.getByText(/login/i)).toBeInTheDocument());
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  test('Unknown route renders 404 component', async () => {
    window.history.pushState({}, '', '/unknown-path');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const notFound = await screen.findByText(/404\s*[–-]\s*Page Not Found/i);
    expect(notFound).toBeInTheDocument();
    expect(reloadSpy).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/unknown-path');
  });
});
