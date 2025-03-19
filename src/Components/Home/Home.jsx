import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

// import propTypes from 'prop-types';
// import { Link } from 'react-router-dom';
 
import { BACKEND_URL } from '../../constants';

const JournalTitleEP = `${BACKEND_URL}/journalTitle`;

function Home(){
    const [error, setError] = useState('');
    const [title, setTitle] = useState([]);
  
    const fetchTitle = () => {
      axios.get(JournalTitleEP)
        .then(({ data }) => {
            // Extract the value using the response key
            const journalTitle = data["Journal Title"];
            setTitle(journalTitle); 
        })
        .catch((error) => setError(`There was a problem retrieving the journal title. ${error.message}`));
    };
    useEffect(fetchTitle, []);
//   return (
//     <div className="wrapper">
//             <header> 
//                 {error && (
//                     <p className="error">{error}</p>
//                 )}  
//                 {/*In case network call doesn't work "Journal" is displayed*/}
//                 <h2 className="journal-title">{title || "Journal"}</h2>
//             </header>
//         </div>
//     );
// }
// export default Home


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="home-wrapper"
        >
            <Container fluid className="hero-section d-flex align-items-center justify-content-center text-center text-white">
                <Row>
                    <Col>
                        {error && <p className="error">{error}</p>}
                        <h1 className="journal-title display-3">{title}</h1>
                        <p className="lead">Celebrating the elegance, history, and artistry of ballroom culture.</p>
                        <Button variant="light" className="mt-3">Explore More</Button>
                    </Col>
                </Row>
            </Container>
            
            <Container className="mission-section text-center my-5">
                <motion.h2 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2 }}>
                    Our Mission
                </motion.h2>
                <p className="lead">To document, share, and celebrate the rich traditions and modern innovations of ballroom dance and culture worldwide.</p>
            </Container>
            
            <Container fluid className="gallery-section text-center py-5">
                <Row>
                    <Col md={4}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <div className="image-placeholder">Image 1</div>
                        </motion.div>
                    </Col>
                    <Col md={4}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <div className="image-placeholder">Image 2</div>
                        </motion.div>
                    </Col>
                    <Col md={4}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <div className="image-placeholder">Image 3</div>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
}

export default Home;
