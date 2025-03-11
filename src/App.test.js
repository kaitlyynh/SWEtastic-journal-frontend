import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import App from './App';
import { homeHeader } from './App';

describe('App', () => {
  it('renders nav and home', async () => {
    render(<App />);

    await screen.findByRole('heading');
    await screen.findAllByRole('listitem');

    expect(screen.getByRole('heading')).toHaveTextContent(homeHeader);
    
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('switches to People view', async () => {
    render(<App />);

    userEvent.click(screen.getByText('View All People'));

    expect(screen.getByRole('heading'))
      .toHaveTextContent('View All People')
  });
});