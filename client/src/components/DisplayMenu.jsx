import React from 'react'
import {Link, useParams} from "react-router-dom"
import ListItemButton from '@mui/material/ListItemButton';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import MealTime from './MealTime.jsx'
import Nav from './Nav.jsx'
import "../App.css"
import Footer from './Footer.jsx'

function DisplayMenu({dict}){
    let hN = decodeURIComponent(useParams().hN);
    if(hN == "Ortega Takeout"){hN = "Ortega"}
    else if (hN == "Carrillo Dining Commons"){ hN = "Carrillo"}
    else if (hN == "De La Guerra Dining Commons"){hN = "De-La-Guerra"}
    else if (hN == "Portola Dining Commons"){hN = "Portola"}
    // if menu item data is empty or all meal times are empty, show closed message
    const isClosed =
        !dict[hN] ||
        Object.keys(dict[hN]).length === 0 ||
        Object.values(dict[hN]).every(stations => !stations || Object.keys(stations).length === 0);
    if (isClosed) {
        return (
            <div className="menu-container">
                <p style={{ textAlign: 'center', marginTop: '2rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {hN} is currently closed.
                </p>
            </div>
        );
    }
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
                    <Col className = "pt-3 flexLeft">
                    <h1 style={{
                        fontWeight: "700",
                        letterSpacing: "0.5px",
                        color: "#0F3C67",
                    }}>{hN}</h1>
                    </Col>
                    {
                        (hN=="De-La-Guerra")
                        ? null
                        : 
                        <>
                        <Col></Col>
                        <Col></Col>
                        </>
                    }
                </Row> 
                <hr></hr>
                <Row>
                    {Object.entries(dict[hN]).map(([times, stations])=>(
                        /* if times object isn't empty, mainly to skip brunch on weekdays and other meals on weekends*/
                        (Object.keys(stations).length !== 0)
                        ? <Col className = "px-5" key={times}>
                        <div>
                            <MealTime time = {times} sections = {stations} ogHn = {hN}/>
                        </div>
                        </Col>
                        : null
                    ))}
                </Row>
                
        </Container>
        <Footer/>
        </>
    )
}

export default DisplayMenu