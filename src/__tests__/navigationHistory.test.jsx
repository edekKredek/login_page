import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import '@testing-library/jest-dom';

describe('Navigation history and reload behavior', () => {
  test('navigating to /success uses History API and does not trigger full page reload', async () => {
    const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {});

    // Ensure we start at the login route
    const initialLength = window.history.length;
    window.history.pushState({}, '', '/');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const user = userEvent.setup();
    const loginButton = await screen.findByRole('button', { name: /login/i });

    await user.click(loginButton);

    // Expect the SuccessPage content to appear
    await waitFor(() => expect(screen.getByText(/success/i)).toBeInTheDocument());

    // No full page reload was attempted
    expect(reloadSpy).not.toHaveBeenCalled();

    // URL updated to /success
    expect(window.location.pathname).toBe('/success');

    // History length increased (at least by 1)
    expect(window.history.length).toBeGreaterThanOrEqual(initialLength + 1);

    reloadSpy.mockRestore();
  });
});
