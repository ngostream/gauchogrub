import React , {useState, useEffect} from "react"
import {Link, useParams} from "react-router-dom"
import axios from "axios"

function FoodReview(){
    let foodItem = decodeURIComponent(useParams().foodItem);
    const [reviewData, setReviewData] = useState([{}]) //from db
    const initialState = {
        name: foodItem,
        review: "",
        rating: 3
    }
    const AverageRating = () =>{
        return (
            <h3>
                Average Rating: {(reviewData.avg_rating > 0) ? (reviewData.avg_rating)?.toFixed(2) + "/5" : ""}
            </h3>
        )
    }
    const [formData, setFormData] = useState(initialState) //to db
    const fetchReviews = async ()=>{
        const response = await axios.get(`http://127.0.0.1:5000/${foodItem}`)
        console.log(response.data, " fetchReviews from FoodReview.jsx")
        setReviewData(response.data)
    }
    const ReviewList = () => {
        return(
            <ul>
                {reviewData.reviews && reviewData.reviews.length > 0 ? (
                    reviewData.reviews.map((review, index) => (
                        <li key={index}>
                            <strong>Rating:</strong> {review.rating}/5 <br />
                            <strong>Comment:</strong> {review.comment} <hr />
                        </li>
                    ))
                ) : (
                    <p>No reviews yet. Be the first to leave one!</p>
                )}
            </ul>
        )
    }
    useEffect(()=>{
        fetchReviews() //returns object which should be used to display lists
    },[])
    
    const handleSubmission = async (e) =>{
        e.preventDefault();
        if(formData.review != ""){
            try{
                const response = await axios.post(`http://127.0.0.1:5000/${foodItem}`, formData, {
                    headers: {"Content-Type": "application/json"}
                })
                console.log(response.data, " handleSubmission from FoodReview.jsx");
                setFormData(initialState);
                fetchReviews();
            }  catch (error){
                console.log(error)
            }
        }
    }
    const handleChange = (e) =>{
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
             {/* Link to = "/hallName" */}
             <AverageRating/>
             <ReviewList/>
             <form onSubmit = {handleSubmission}>
                 <label htmlFor="rating">Rating (1-5):</label>
                 <select name="rating" id="rating" onChange={handleChange} value = {formData.rating}>
                     <option value="1">1 - Inedible</option>
                     <option value="2">2 - Bad</option>
                     <option value="3">3 - Mid</option>
                     <option value="4">4 - Good</option>
                     <option value="5">5 - Excellent</option>
                 </select>
                 <textarea onChange={handleChange} value = {formData.review} name="review" rows="4" cols="50" placeholder="boom or doom"></textarea>
                 <button type="submit">Submit</button>
             </form>
        </div> 
    )
}

export default FoodReview