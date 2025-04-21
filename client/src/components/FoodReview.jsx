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
import Footer from './Footer.jsx'
import axios from "axios"
import "../App.css"

function FoodReview(){
    let foodItem = decodeURIComponent(useParams().foodItem);
    let hN = decodeURIComponent(useParams().hN);
    let dbName = "";
    if(hN == "Carrillo Dining Commons"){dbName = "Carrillo"}
    else if(hN == "De La Guerra Dining Commons"){dbName = "De-La-Guerra"}
    else if(hN == "Ortega Takeout"){dbName = "Ortega"}
    else if(hN == "Portola Dining Commons"){dbName = "Portola"}
    const [reviewData, setReviewData] = useState([{}]) //from db
    const initialState = {
        name: foodItem,
        review: "",
        rating: 3
    }
    const AverageRating = () =>{
        return (
            <h3 className = "py-1">
                Average Rating: {(reviewData.avg_rating > 0) ? (reviewData.avg_rating)?.toFixed(2) + "/5" : ""}
            </h3>
        )
    }
    const [formData, setFormData] = useState(initialState) //to db
    const StarRating = () =>{ //maybe put into its own component file?
        return (
            <div className = "px-3 me-1 flexCenter">
            <Stack spacing={1}>
              <Rating name="rating" id = "rating" onChange = {handleChange} value ={formData.rating} size="large" />
            </Stack>
            </div>
          )
    }
    const fetchReviews = async () => {
        const response = await axios.get(`http://127.0.0.1:5000/${dbName}/${foodItem}`)
        console.log(response.data, " fetchReviews from FoodReview.jsx")
        setReviewData(response.data)
    }
    const ReviewList = () => {
        return(
            <Row>
                {reviewData.reviews && reviewData.reviews.length > 0 ? (
                    reviewData.reviews.map((review, index) => (
                        <Col className = "pb-3" md={3} key = {index}>
                        <Card sx = {{minHeight: "100px"}}variant = "outlined">
                            <CardContent>
                            <div className = "flexLeft"> <ReadOnlyStar r = {review.rating} size = "medium"/> <br/> </div>
                            <div className=  "flexLeft"><p style= {{textAlign: "left"}}>{review.comment}</p></div>
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
    useEffect(()=>{
        fetchReviews();
    },[])
    
    const handleSubmission = async (e) =>{
        e.preventDefault();
        if(formData.review != ""){
            try{
                const response = await axios.post(`http://127.0.0.1:5000/${dbName}/${foodItem}`, formData, {
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
        <Container>
            <Nav/>
            <div className = "flexLeft">
                <Link to = {`/${hN}`}>
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
                <h1> {foodItem}</h1> <hr/>
                <div className = "flexCenter">
                <form onSubmit = {handleSubmission}>
                    {/* text area and submit button are ugly gotta fix */}
                    <textarea onChange={handleChange} value = {formData.review} name="review" rows="4" cols="40" placeholder="Write your review here"></textarea>
                    <div className = "flexCenter">
                    <button type="submit">Submit</button> 
                    <StarRating/>
                    </div>
                </form>
                </div>
                <AverageRating/>
                <ReviewList/>
             </Row>
             <Footer/>
        </Container>
    )
}

export default FoodReview