import React from 'react'
import {Link, useParams} from "react-router-dom"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
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
                        <Col sm = {3} md = {12}>
                        <h1>{hN}</h1>
                        <hr></hr>
                        {Object.entries(dict[hN]).map(([times, stations])=>(
                            /* if times object isn't empty, mainly to skip brunch on weekdays and other meals on weekends*/
                            (Object.keys(stations).length !== 0)
                            ? <div key = {times}>
                            <h2>{times}</h2>
                            {Object.entries(stations).map(([stations,food])=>(
                                <div key = {stations}>
                                <h3 style = {{fontWeight: "normal"}} key = {stations}>{stations}</h3>
                                {food.map((items)=>(
                                    <div key = {items}>
                                        <Link to={`/${ogHn}/${encodeURIComponent(items)}`}><p style ={{color: "black", fontWeight: "normal"}} > {items}</p></Link>
                                         {/*className = "hover-effect"  */}
                                    </div>
                                ))}
                                </div>
                            ))}
                            </div>
                            : null
                        ))}
                    </Col>
                </Row>
        </Container>
    )
}

export default DisplayMenu