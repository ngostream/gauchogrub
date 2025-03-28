import React from 'react'
import {Link} from "react-router-dom"
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
                    <Link to ="/display"><HallCard hallName = "Carrillo Dining Commons"/></Link>
                </Col>
                <Col  sm = {12} md = {6} className = "pb-3">
                    <Link to ="/display"><HallCard hallName = "De La Guerra Dining Commons"/></Link>
                </Col>
                <Col  sm = {12} md = {6} className = "pb-3">
                    <Link to = "/display"><HallCard hallName = "Portola Dining Commons"/> </Link>
                </Col>
                <Col sm = {12} md = {6} className = "pb-3">
                    <Link to ="/display"> <HallCard hallName = "Ortega Takeout"/> </Link> 
                    {/* needs handling for weekends/ not open */}
                </Col>
            </Row>
        </Container>
    )
}







export default DisplayHalls