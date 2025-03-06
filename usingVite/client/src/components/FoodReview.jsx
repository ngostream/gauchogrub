import React from "react"
import {Link, useParams} from "react-router-dom"
import axios from "axios" //will use axios to get and post reviews with backend 

function FoodReview(){
    let {foodItem} = useParams();
    console.log({foodItem})
    return(
        <div>
            <Link to ="/">{foodItem}</Link>
        </div>
    )
}

export default FoodReview