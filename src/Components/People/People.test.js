import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import People from './People';

describe('People component', () => {
  it('shows form when add-person button is clicked', async () => {
    render(<People />);

    await userEvent.click(screen.getByText('Add a Person'));
    await screen.findAllByRole('textbox');

    expect(screen.getAllByRole('textbox')).toHaveLength(3);

  });
});

/* 
// The following code mocks a network call. Unfortunately, the module 'msw' has a tricky dependancy conflict with a module set up by create-react-app that I wasn't able to unravel. For now don't worry about mocking network calls, but feel free to go at it if you'd like. More info in this example: https://testing-library.com/docs/react-testing-library/example-intro
*/

// import { setupServer } from 'msw/node';

// const TEST_NAME = 'John Doe';
// const TEST_EMAIL = 'test@test.com';
// const TEST_RESPONSE = {
//   TEST_EMAIL : {
//     'name': TEST_NAME,
//     'affiliation': '',
//     'email': TEST_EMAIL,
//     'roles': [
//       'ED'
//     ]
//   }
// };

// // declare which API requests to mock
// const server = setupServer(
//   // capture "GET /people" requests
//   http.get('/people', (req, res, ctx) => {
//     // respond using a mocked JSON body
//     return HttpResponse.json(TEST_RESPONSE);
//   }),
// );

// beforeAll(() => server.listen());

// afterEach(() => server.resetHandlers());

// afterAll(() => server.close());