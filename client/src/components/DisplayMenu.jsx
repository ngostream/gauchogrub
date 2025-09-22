import React from 'react'
import {Link, useParams} from "react-router-dom"
import ListItemButton from '@mui/material/ListItemButton';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import MealTime from './MealTime.jsx'
import Nav from './Nav.jsx'
import "../App.css"

import { normalizeHallName, displayHallName } from "../utils/hallNames.js"

function DisplayMenu({ dict }) {
    let rawHN = decodeURIComponent(useParams().hN);
    let hN = normalizeHallName(rawHN); // backend key
    let prettyName = displayHallName(hN); // what users see

    const isClosed =
        !dict[hN] ||
        Object.keys(dict[hN]).length === 0 ||
        Object.values(dict[hN]).every(stations => !stations || Object.keys(stations).length === 0);

    return (
        <>
        <Container style ={{paddingBottom: "80px"}}>
            <Nav/>
            {/* back button */}
            <div className="flexLeft">
                <Link to="/">
                    <ListItemButton sx={{
                        color: "black",
                        marginBottom: '10px',
                        marginTop: '10px',
                        borderLeft: '6px solid #0F3C67',
                        borderRadius: '4px',
                        padding: "7px",
                        paddingLeft: "10px",
                        paddingRight: "11px",
                        backgroundColor: '#F9F9F9',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        Back
                    </ListItemButton>
                </Link>
            </div>
                <Row>
                    <Col className="pt-3">
                        <h1 className="page-header">
                            {prettyName}
                        </h1>
                    </Col>
                </Row>
                <hr></hr>
                <Row>
                    {isClosed ? (
                        <Col>
                            <div className="menu-container">
                                <p style={{ textAlign: 'center', marginTop: '2rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    {prettyName} is currently closed.
                                </p>
                            </div>
                        </Col>
                    ) : (
                        /* if times object isn't empty, mainly to skip brunch on weekdays and other meals on weekends*/
                        Object.entries(dict[hN]).map(([times, stations]) => (
                            (Object.keys(stations).length !== 0)
                            ? <Col className = "px-5" key={times}>
                            <div>
                                <MealTime time = {times} sections = {stations} ogHn = {hN}/>
                            </div>
                            </Col>
                            : null
                        ))
                    )}
                </Row>
                
        </Container>

        </>
    )
}

export default DisplayMenu