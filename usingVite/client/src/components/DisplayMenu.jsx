import React from 'react'
import {Link} from "react-router-dom"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "../App.css"
function DisplayMenu(dict){

    return(

        <Container>
            {Object.entries(dict).map(([top,hallNames])=>(
                 <Row key = {top}>
                    {Object.entries(hallNames).map(([hallName,times])=>(
                        <Col md = {3} key = {hallName}>
                            {(hallName === "De-La-Guerra")
                            ? <h1>DLG</h1>
                            :<h1>{hallName}</h1>
                            }
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
                                            <Link to={`/${encodeURIComponent(items)}`}><p style ={{color: "black", fontWeight: "normal"}} className = "hover-effect"> {items}</p></Link>
                                        </div>
                                    ))}
                                    </div>
                                ))}
                                </div>
                                : null
                            ))}
                        </Col>
                    ))}
                </Row>
            ))}
        </Container>
    )
}

export default DisplayMenu