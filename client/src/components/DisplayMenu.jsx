import React from 'react'
import {Link,useParams} from "react-router-dom"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import MealTime from './MealTime.jsx'
import "../App.css"

function DisplayMenu({dict}){
    let hN = decodeURIComponent(useParams().hN);
    let ogHn = hN;
    if(hN == "Ortega Takeout"){hN = "Ortega"}
    else if (hN == "Carrillo Dining Commons"){ hN = "Carrillo"}
    else if (hN == "De La Guerra Dining Commons"){hN = "De-La-Guerra"}
    else if (hN == "Portola Dining Commons"){hN = "Portola"}
          {/* <CardActions> */}
        {/* <Button size="small">Directions</Button> link to maps? */}
        {/* <Button size="small">Learn More</Button> */}
      {/* </CardActions> */}
    return(
        <Container>
                    <Row>
                    <Link to ="/"><h1>{hN}</h1> </Link>
                    <hr></hr>
                        {Object.entries(dict[hN]).map(([times, stations])=>(
                            /* if times object isn't empty, mainly to skip brunch on weekdays and other meals on weekends*/
                            (Object.keys(stations).length !== 0)
                            ? <Col>
                            <div key = {times}>
                                <MealTime time = {times} sections = {stations} ogHn = {ogHn}/>
                            </div>
                            </Col>
                            : null
                        ))}
                </Row>
        </Container>
    )
}

export default DisplayMenu