import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Spotify login button', () => {
  render(<App />);
  const linkElement = screen.getByText(/connect to spotify/i);
  expect(linkElement).toBeInTheDocument();
});
