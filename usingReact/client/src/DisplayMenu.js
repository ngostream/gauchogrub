import React from 'react'
import "./App.css"
function DisplayMenu(props){
    //find way to skip rendering brunch if weekday, maybe check if brunch key's value is empty
    //also turn each header into dropdown?
    return(
        <div class = "container">
            {Object.entries(props).map(([top,hallNames])=>(
                 <div class = "row" key = {top}>
                    {Object.entries(hallNames).map(([hallName,times])=>(
                        <div class = "col-3" key = {hallName}>
                            <h1>{hallName}</h1>
                            {Object.entries(times).map(([times, stations])=>(
                                <div key = {times}>
                                <h2>{times}</h2>
                                {Object.entries(stations).map(([stations,food])=>(
                                    <div key = {stations}>
                                    <h3 style = {{fontWeight: "normal"}} key = {stations}>{stations}</h3>
                                    {food.map((items)=>(
                                        <div key = {items}>
                                            <p class = "hover-effect"> {items}</p>
                                        </div>
                                    ))}
                                    </div>
                                ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default DisplayMenu