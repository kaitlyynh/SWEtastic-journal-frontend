import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PeopleDetails from './PeopleDetails';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

delete window.location;
window.location = { reload: jest.fn() };

const mockPerson = {
  email: 'test@example.com',
  name: 'John Doe',
  affiliation: 'NYU',
  roles: ['admin', 'editor'],
};

const initialPerson = { email: 'test@example.com', name: 'Test User' };

const mockRoles = {
  AU: 'Author',
  ED: 'Editor',
  RE: 'Referee',
};

describe('PeopleDetails Component', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/roles')) {
        return Promise.resolve({ data: mockRoles });
      }
      return Promise.resolve({ data: mockPerson });
    });
  });

//   test('renders person details correctly', async () => {
//     render(
//       <BrowserRouter>
//         <PeopleDetails location={{ state: { person: initialPerson } }} />
//       </BrowserRouter>
//     );

//     expect(await screen.findByText(/Email:/)).toBeInTheDocument();
//     expect(screen.getByText(initialPerson.email)).toBeInTheDocument();
//     expect(screen.getByText(initialPerson.name)).toBeInTheDocument();
//   });

//   test('displays correct role names instead of keys', async () => {
//     render(
//       <BrowserRouter>
//         <PeopleDetails location={{ state: { person: mockPerson } }} />
//       </BrowserRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByText(/Roles:/)).toBeInTheDocument();
//       expect(screen.getByText('Author, Editor')).toBeInTheDocument();
//     });
//   });

//   test('shows role key when no matching role name exists', async () => {
//     const mockPersonWithUnknownRole = { ...mockPerson, roles: ['admin', 'unknownRole'] };

//     render(
//       <BrowserRouter>
//         <PeopleDetails location={{ state: { person: mockPersonWithUnknownRole } }} />
//       </BrowserRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByText(/Roles:/)).toBeInTheDocument();
//       expect(screen.getByText('Author, unknownRole')).toBeInTheDocument();
//     });
//   });

  test('refresh button reloads the page', async () => {
    render(
      <BrowserRouter>
        <PeopleDetails location={{ state: { person: mockPerson } }} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Refresh Page'));
    expect(window.location.reload).toHaveBeenCalled();
  });

  test('return to people button navigates to /people', async () => {
    render(
      <BrowserRouter>
        <PeopleDetails location={{ state: { person: mockPerson } }} />
      </BrowserRouter>
    );

    expect(screen.getByText('Return to People List').closest('a')).toHaveAttribute('href', '/people');
  });
});
