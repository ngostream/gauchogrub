import React from 'react'
import {Link} from "react-router-dom"
import "../App.css"
function DisplayMenu(dict){
    //turn each header into dropdown

    return(

        <div class = "container">
            {Object.entries(dict).map(([top,hallNames])=>(
                 <div class = "row" key = {top}>
                    {Object.entries(hallNames).map(([hallName,times])=>(
                        <div class = "col-3" key = {hallName}>
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
                                            <Link to={`/${items}`}><p style ={{color: "black", fontWeight: "normal"}} class = "hover-effect"> {items}</p></Link>
                                        </div>
                                    ))}
                                    </div>
                                ))}
                                </div>
                                : null
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default DisplayMenu