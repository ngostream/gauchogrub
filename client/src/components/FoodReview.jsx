import React , {useState, useEffect} from "react"
import {Link, useParams} from "react-router-dom"
import Container from 'react-bootstrap/Container'
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import ReadOnlyStar from './ReadOnlyStar.jsx';
import ListItemButton from '@mui/material/ListItemButton';
import Nav from './Nav.jsx'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import axios from "axios"
import "../App.css"
import leoProfanity from "leo-profanity";
import { normalizeHallName, displayHallName } from "../utils/hallNames.js"

function FoodReview(){
    let foodItem = decodeURIComponent(useParams().foodItem);
    let safeFoodItem = foodItem.replaceAll("/", "__slash__"); //to avoid issues with slashes being interpreted as a subdirectory
    let rawHN = decodeURIComponent(useParams().hN);
    let hN = normalizeHallName(rawHN); // backend key
    let prettyHall = displayHallName(hN); // user-facing
    const [reviewData, setReviewData] = useState([{}]) //from db
    const initialState = {
        name: foodItem,
        review: "",
        rating: 3
    }
                {/* Average Rating: {(reviewData.avg_rating > 0) ? (reviewData.avg_rating)?.toFixed(2) + "/5" : ""} */}

    const [formData, setFormData] = useState(initialState) //to db
    const [submitted, setSubmitted] = useState(false); // track whether or not user submitted review
    const [isSubmitting, setIsSubmitting] = useState(false);
    const StarRating = () =>{ //maybe put into its own component file?
        return (
            <div className = "px-3 me-1 flexCenter">
            <Stack spacing={1}>
              <Rating name="rating" id = "rating" onChange = {handleChange} value ={formData.rating} precision={0.5} size="large" />
            </Stack>
            </div>
          )
    }
    const fetchReviews = React.useCallback(async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${hN}/${encodeURIComponent(safeFoodItem)}`)
    setReviewData(response.data)
    }, [hN, safeFoodItem]);
    const ReviewList = () => {
        return(
            <Row>
                {reviewData.reviews && reviewData.reviews.length > 0 ? (
                    reviewData.reviews.map((review, index) => (
                        <Col className = "pb-3" md={3} key = {index}>
                        <Card sx = {{minHeight: "100px"}}variant = "outlined">
                            <CardContent>
                                <div
                                    style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "8px",
                                    }}
                                >
                                    <ReadOnlyStar r={review.rating} />
                                    <div
                                    style={{
                                        color: "#6c757d",
                                        fontSize: "0.85rem",
                                    }}
                                    >
                                    {new Date(review.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                    </div>
                                </div>
                                <div className=  "flexLeft"> {review.comment}</div>
                            </CardContent>
                        </Card>
                        </Col>
                    ))
                ) : (
                    <p>No reviews yet. Be the first to leave one!</p>
                )}
            </Row>
        )
    }
        useEffect(() => {
                fetchReviews();
        }, [fetchReviews, safeFoodItem]);      
    
    const handleSubmission = async (e) =>{
        e.preventDefault();

        if (submitted) return;
        setIsSubmitting(true);

        const trimmedReview = formData.review.trim();
        
        // empty
        if (trimmedReview == "") {
            alert("Please enter a review before submitting.");
            setIsSubmitting(false);

            return;
        }
        
        // too long
        if (trimmedReview.length > 300) {
            alert("Review cannot exceed 300 characters.");
            setIsSubmitting(false);
            return;
        }

        // profanity
        if (leoProfanity.check(trimmedReview)) {
            alert("Please avoid using offensive language.");
            setIsSubmitting(false);
            return;
        }

        try{
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/${hN}/${encodeURIComponent(safeFoodItem)}`, formData, {
                headers: {"Content-Type": "application/json"}
            })
            // error logging only
            setFormData(initialState);
            setSubmitted(true);
            fetchReviews();
        }  catch (error){
            console.error(error)
            // re enable
            setIsSubmitting(false);
        }
    }
    const handleChange = (e) =>{
        let value = e.target.value; //element that called handleChange 's current value
        let name = e.target.name; //id basically
        setFormData(
            {
            ...formData,
            [name]: name=== "rating" ? parseFloat(value) : value
            }
        )
    }
    return(
        <Container>
            <Nav/>
            <div className = "flexLeft">
                <Link to = {`/${rawHN}`}>
                <ListItemButton sx={{
                    color: "black",
                    marginBottom: '10px',
                    marginTop: '10px',
                    borderLeft: '6px solid #0F3C67',
                    borderRadius: '4px',
                    padding: "7px",
                    paddingLeft: "10px",
                    paddingRight: "11px",
                    backgroundColor: '#F9F9F9',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                    }}>Back</ListItemButton>
                </Link>
            </div>
            <Row>
                <Col className="pt-3">
                    <h1 className="page-header">{foodItem} @ {prettyHall}</h1>
                </Col>
            </Row>
            <hr />
                <div className = "flexCenter">
                <form onSubmit = {handleSubmission}>
                    <textarea
                    style={{ 
                        backgroundColor: '#f9f9f9',
                        color: '#333',
                        border: '1px solid #ccc', 
                        borderRadius: '4px',
                        padding: '0.5rem',
                    }}
                    onChange={handleChange}
                    value = {formData.review}
                    name="review"
                    rows="4"
                    cols="40"
                    placeholder="Write your review here"
                    maxLength={300}
                    ></textarea>
                    <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.25rem" }}>
                    {formData.review.length}/300 characters
                    </p>
                    <div className = "flexCenter py-1 pb-3">
                    <button type="submit" disabled={submitted || isSubmitting}>
                        {submitted ? "Submitted" : isSubmitting ? "Submitting…" : "Submit"}
                    </button>
                    <StarRating/>
                    </div>
                </form>
                </div>
                <ReviewList/>

        </Container>
    )
}

export default FoodReview