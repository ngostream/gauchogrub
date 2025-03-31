import React from 'react'
import {Link, useParams} from "react-router-dom"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "../App.css"
function DisplayMenu(dict){
    let hN = decodeURIComponent(useParams().hN);
    let ogHn = hN;
    if(hN == "Ortega Takeout"){hN = "Ortega"}
    else if (hN == "Carrillo Dining Commons"){ hN = "Carrillo"}
          {/* <CardActions> */}
        {/* <Button size="small">Directions</Button> link to maps? */}
        {/* <Button size="small">Learn More</Button> */}
      {/* </CardActions> */}

    return(

        <Container>
            {Object.entries(dict).map(([top,hallNames])=>(
                 <Row key = {top}>
                    {Object.entries(hallNames).map(([hallName,times])=>(
                        (hallName === hN)
                            ? 
                            <Col md = {3} key = {hallName}>
                            <h1>{hallName}</h1>
                            <hr></hr>
                            {Object.entries(times).map(([times, stations])=>(
                                /* if times object isn't empty, mainly to skip brunch on weekdays and other meals on weekends*/
                                (Object.keys(stations).length !== 0)
                                ? <div key = {times}>
                                <h2>{times}</h2>
                                {Object.entries(stations).map(([stations,food])=>(
                                    <div key = {stations}>
                                    <h3 style = {{fontWeight: "normal"}} key = {stations}>{stations}</h3>
                                    {food.map((items)=>(
                                        <div key = {items}>
                                            <Link to={`/${ogHn}/${encodeURIComponent(items)}`}><p style ={{color: "black", fontWeight: "normal"}} className = "hover-effect"> {items}</p></Link>
                                        </div>
                                    ))}
                                    </div>
                                ))}
                                </div>
                                : null
                            ))}
                        </Col>
                            : null
                    ))}
                </Row>
            ))}
        </Container>
    )
}

export default DisplayMenu