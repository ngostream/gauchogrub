import React from 'react'
import HallCard from "./HallCard.jsx"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from './Nav.jsx'
import "../App.css"

function DisplayHalls(){
    return(
            <Container>
                <Nav/>
                <br/> {/* maybe no break?*/}
            <Row>
                <Col sm = {12} md = {6} className = "pb-3">
                    <HallCard hN = "Carrillo Dining Commons"/>
                </Col>
                <Col  sm = {12} md = {6} className = "pb-3">
                    <HallCard hN = "De La Guerra Dining Commons"/>
                </Col>
                <Col  sm = {12} md = {6} className = "pb-3">
                    <HallCard hN = "Portola Dining Commons"/>
                </Col>
                <Col sm = {12} md = {6} className = "pb-3">
                    <HallCard hN = "Ortega Takeout"/>
                    {/* needs handling for weekends/ not open */}
                </Col>
            </Row>
        </Container>
    )
}







export default DisplayHalls