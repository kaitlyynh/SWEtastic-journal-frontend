import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

beforeEach(() => {
  localStorage.clear(); // Clear local storage before each test
});

test('renders login form when not authenticated', () => {
  // simulate visiting the /login route
  window.history.pushState({}, 'Login Page', '/login');

  render(<App />);

  // Check if email, password fields and login button are rendered
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('renders home page when authenticated', () => {
  // Mock authentication by setting localStorage item
  localStorage.setItem('loggedIn', 'true');

  // simulate visiting the /home route
  window.history.pushState({}, 'Home Page', '/home');

  render(<App />);

  // Check if navigation items appear
  expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /people/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /masthead/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /submissions/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
});
