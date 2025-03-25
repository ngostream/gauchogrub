import React from 'react'
import {Link} from "react-router-dom"
import HallCard from "./HallCard.jsx"
import "../App.css"

function DisplayHalls(){
    return(
        <div class = "container">
            <div class = "row">
                <div class = "col-6 pb-2">
                    <HallCard hallName = "Carrillo Dining Commons"/>
                </div>
                <div class = "col-6 pb-2">
                    <HallCard hallName = "De La Guerra Dining Commons"/>
                </div>
                <div class = "col-6">
                    <HallCard hallName = "Portola Dining Commons"/>
                </div>
                <div class = "col-6">
                    <HallCard hallName = "Ortega Takeout"/>
                </div>
            </div>
        </div>
    )
}







export default DisplayHalls