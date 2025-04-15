import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  // useParams,
} from 'react-router-dom';

import './App.css';

import Navbar from './Components/Navbar';
import People from './Components/People';
import Home from './Components/Home';
import PersonDetails from './Components/PeopleDetails/PeopleDetails';
import Manuscript from './Components/Manuscript/Manuscript';
import Registration from './Components/Registration/Registration';
import Login from './Components/Login/Login';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Masthead from "./Components/Masthead/Masthead";
import ManuscriptDetails from './Components/ManuscriptDetails/ManuscriptDetails';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* public */}
        <Route path="registration" element={<Registration />} />
        <Route path="login" element={<Login />} />
        <Route path="home" element={<Home />} />
        <Route index element={<Home />} />

        {/* protected */}
        <Route
          path="people"
          element={
            <ProtectedRoute>
              <People />
            </ProtectedRoute>
          }
        />
        <Route
          path="masthead"
          element={
            <ProtectedRoute>
              <Masthead />
            </ProtectedRoute>
          }
        />
        <Route
          path="people/:name"
          element={
            <ProtectedRoute>
              <PersonDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="manuscripts"
          element={
            <ProtectedRoute>
              <Manuscript />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manuscripts/:title" 
          element={
          <ProtectedRoute>
            {<ManuscriptDetails />}
          </ProtectedRoute>
          }
        >

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;