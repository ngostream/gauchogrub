import React from 'react'
import {Link} from "react-router-dom"
import HallCard from "./HallCard.jsx"
import "../App.css"

function DisplayHalls(){
    return(
        <div class = "container">
            <div class = "row">
                <div class = "col-6 pb-2">
                    <Link to ="/display"><HallCard hallName = "Carrillo Dining Commons"/></Link>
                </div>
                <div class = "col-6 pb-2">
                    <Link to ="/display"><HallCard hallName = "De La Guerra Dining Commons"/></Link>
                </div>
                <div class = "col-6">
                    <Link to = "/display"><HallCard hallName = "Portola Dining Commons"/> </Link>
                </div>
                <div class = "col-6">
                    <Link to ="/display"> <HallCard hallName = "Ortega Takeout"/> </Link> 
                    {/* needs handling for weekends/ not open */}
                </div>
            </div>
        </div>
    )
}







export default DisplayHalls