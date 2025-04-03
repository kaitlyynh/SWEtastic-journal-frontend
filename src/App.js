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
import 'bootstrap/dist/css/bootstrap.min.css';

// function PersonPage() {
//   const { name } = useParams();
//   return <h1>{name}</h1>
// }

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* For a different home page, do:
         <Route index element={<Login />} /> */}
        <Route path="people" element={<People />} />
        <Route path="people/:name" element={<PersonDetails />} />
        <Route path='home' element={<Home />} />
        <Route index element={<Home />} />
        <Route path="manuscripts" element={<Manuscript />} />
        <Route path="registration" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;