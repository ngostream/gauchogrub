import React from 'react'
import HallCard from "./HallCard.jsx"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'
import "../App.css"

export default function DisplayHalls(){
    return(
        <>
            <Container>
            <Nav/>
                <br/>
            <Row>
                <Col sm = {12} md = {6} className = "pb-3">
                    <HallCard hN = "Carrillo Dining Commons"/>
                </Col>
                <Col  sm = {12} md = {6} className = "pb-3">
                    <HallCard hN = "De La Guerra Dining Commons"/>
                </Col>
                <Col  sm = {12} md = {6} className = "pb-4">
                    <HallCard hN = "Portola Dining Commons"/>
                </Col>
                <Col sm = {12} md = {6} className = "pb-4">
                    <HallCard hN = "Ortega Takeout"/>
                    {/* needs handling for weekends/ not open */}
                </Col>
            </Row>
            <Footer/>
        </Container>
        </>
    )
}






