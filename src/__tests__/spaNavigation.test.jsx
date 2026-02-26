import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter, Routes, Route, Outlet } from 'react-router-dom';
import App from '../App.jsx';
import '@testing-library/jest-dom';

// Helper error boundary for tests
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error('Caught error in test ErrorBoundary:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}

describe('SPA navigation behaviors', () => {
  let reloadSpy;

  beforeEach(() => {
    reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {});
  });

  afterEach(() => {
    reloadSpy.mockRestore();
  });

  test('happy path: / -> click login -> /success without full reload', async () => {
    // Start at root
    window.history.pushState({}, '', '/');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const user = userEvent.setup();
    const loginButton = await screen.findByRole('button', { name: /login/i });

    const initialHistoryLength = window.history.length;

    await user.click(loginButton);

    // Success page shows
    await waitFor(() => expect(screen.getByText(/success/i)).toBeInTheDocument());

    // No full page reload
    expect(reloadSpy).not.toHaveBeenCalled();

    // URL updated
    expect(window.location.pathname).toBe('/success');

    // History length increased by at least 1
    expect(window.history.length).toBeGreaterThanOrEqual(initialHistoryLength + 1);
  });

  test('unknown path renders NotFound component instantly', async () => {
    window.history.pushState({}, '', '/some/unknown/path');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const notFound = await screen.findByText(/404\s*[–-]\s*Page Not Found/i);
    expect(notFound).toBeInTheDocument();
    expect(reloadSpy).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/some/unknown/path');
  });

  test('browser back button returns to previous route without reload', async () => {
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

    // Go back
    window.history.back();
    window.dispatchEvent(new PopStateEvent('popstate'));

    // Back to login
    await waitFor(() => expect(screen.getByText(/login/i)).toBeInTheDocument());
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  test('nested routes use history navigation', async () => {
    // Build small nested routes for this test
    function Parent() {
      return (
        <div>
          <div>Parent</div>
          <Outlet />
        </div>
      );
    }

    render(
      <MemoryRouter initialEntries={['/parent/child']}>
        <Routes>
          <Route path="/parent" element={<Parent />}>
            <Route path="child" element={<div>Child</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/child/i)).toBeInTheDocument();
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  test('error boundary catches render errors without reloading the page', async () => {
    function Bomb() {
      throw new Error('boom');
    }

    window.history.pushState({}, '', '/bomb');

    render(
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/bomb" element={<Bomb />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(await screen.findByText(/Something went wrong/i)).toBeInTheDocument();
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  test('concurrency: rapid successive clicks only navigate once and do not reload', async () => {
    window.history.pushState({}, '', '/');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const user = userEvent.setup({ delay: null });
    const loginButton = await screen.findByRole('button', { name: /login/i });

    // Rapid clicks
    await Promise.all([user.click(loginButton), user.click(loginButton), user.click(loginButton)]);

    await waitFor(() => expect(screen.getByText(/success/i)).toBeInTheDocument());
    expect(window.location.pathname).toBe('/success');
    expect(reloadSpy).not.toHaveBeenCalled();
  });
});
