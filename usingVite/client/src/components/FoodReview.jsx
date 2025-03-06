import React from "react"
import {Link, useParams} from "react-router-dom"
import axios from "axios" //will use axios to get and post reviews with backend 

function FoodReview(){
    let foodItem = decodeURIComponent(useParams().foodItem);
    return(
        <div class = "container">
             <Link to ="/"><h1> {foodItem}</h1></Link>
        {/*      
        rework into jsx from jinja
        <h3>Average Rating: {{ avg_rating | round(2) }}/5</h3>
             <h2>Reviews:</h2>
             <!-- loop thru reviews here-->
             {% if reviews %}
                 <ul>
                     {% for review in reviews%}
                         <li>
                             <strong>Rating:</strong> {{ review.rating }}/5 <br>
                             <strong>Comment:</strong> {{ review.comment }}
                         </li>
                     {% endfor %}
                 </ul>
             {% else %}
                 <p>No reviews yet. Be the first one to leave one!</p>
             {% endif %}
             <h3>Leave a Review</h3>
             <form action="{{ url_for('food_detail', food_name=food_name) }}" method="POST">
                 <label for="rating">Rating (1-5):</label>
                 <select name="rating" id="rating">
                     <option value="1">1 - inedible</option>
                     <option value="2">2 - bad</option>
                     <option value="3">3 - mid</option>
                     <option value="4">4 - good</option>
                     <option value="5" selected> 5 - excellent</option>
                 </select>
                 <br>
                 <textarea name="review" rows="4" cols="50" placeholder="Write your review here..."></textarea>
                 <br>
                 <button type="submit">Submit</button>
             </form>
             <a href="{{ url_for('display_meals') }}">Back to Menu</a>
             */}
        </div> 
    )
}

export default FoodReview