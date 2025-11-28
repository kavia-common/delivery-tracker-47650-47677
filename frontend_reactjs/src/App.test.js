import { render } from '@testing-library/react';
import App from './App';

test('renders app root without crashing', () => {
  render(<App />);
});
