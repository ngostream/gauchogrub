import React , {useState, useEffect} from "react"
import {Link, useParams} from "react-router-dom"
import axios from "axios"

function FoodReview(){
    let foodItem = decodeURIComponent(useParams().foodItem);
    const [reviewData, setReviewData] = useState([{}])
    const [formData, setFormData] = useState({name: foodItem, review: "", rating: 3})
    const fetchReviews = async ()=>{
        const response = await axios.get(`http://127.0.0.1:5000/${foodItem}`)
        console.log(response.data)
        setReviewData(response.data)
    }
    useEffect(()=>{
        fetchReviews() //returns object which should be used to display lists
    },[])
    
    const handleSubmission = async (e) =>{
        e.preventDefault();
        try{
        const response = await axios.post(`http://127.0.0.1:5000/${foodItem}`, formData, {
            headers: {"Content-Type": "application/json"}
        })
        console.log(response.data);
        }  catch (error){
            console.log(error)
        }
    }
    const handleChange = (e) =>{ //updates formData state 
        let value = e.target.value; //element that called handleChange 's current value
        let name = e.target.name; //id basically
        setFormData(
            {
            ...formData,
            [name]: name=== "rating" ? parseInt(value,10) : value
            }
        )
    }
    return(
        <div className = "container">
             <Link to ="/"><h1> {foodItem}</h1></Link>
             <form onSubmit = {handleSubmission}>
                 <label htmlFor="rating">Rating (1-5):</label>
                 <select name="rating" id="rating" onChange={handleChange} defaultValue = "3">
                     <option value="1">1 - Inedible</option>
                     <option value="2">2 - Bad</option>
                     <option value="3">3 - Mid</option>
                     <option value="4">4 - Good</option>
                     <option value="5">5 - Excellent</option>
                 </select>
                 <textarea onChange={handleChange} value = {formData.review} name="review" rows="4" cols="50" placeholder="boom or doom"></textarea>
                 <button type="submit">Submit</button>
             </form>
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