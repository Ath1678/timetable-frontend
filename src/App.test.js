import { render, screen } from '@testing-library/react';
import App from './App';

test('renders sidebar with Timetable Pro', () => {
  render(<App />);
  const titleElement = screen.getByText(/Timetable Pro/i);
  expect(titleElement).toBeInTheDocument();
});
