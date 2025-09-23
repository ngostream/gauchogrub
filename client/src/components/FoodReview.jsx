// FoodReview.jsx

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import ListItemButton from "@mui/material/ListItemButton";
import Nav from "./Nav.jsx";
import ReadOnlyStar from "./ReadOnlyStar.jsx";

import axios from "axios";
import leoProfanity from "leo-profanity";
import { normalizeHallName, displayHallName } from "../utils/hallNames.js";
import BackButton from "./BackButton.jsx";

import "../App.css";

function FoodReview() {
  // get food item and hall name from url
  let foodItem = decodeURIComponent(useParams().foodItem);
  let safeFoodItem = foodItem.replaceAll("/", "__slash__"); //to avoid issues with slashes being interpreted as a subdirectory
  let rawHN = decodeURIComponent(useParams().hN);
  let hN = normalizeHallName(rawHN); // backend key
  let prettyHall = displayHallName(hN); // user-facing

  const [reviewData, setReviewData] = useState([{}]); // from db
  const initialState = { name: foodItem, review: "", rating: 3 };
  const [formData, setFormData] = useState(initialState); // to db
  const [submitted, setSubmitted] = useState(false); // track whether or not user submitted review
  const [isSubmitting, setIsSubmitting] = useState(false); // prevent double submissions

  const cacheKey = `${hN}-${safeFoodItem}-reviews`; // for localstorage caching

  // fetch reviews from backend, use localstorage cache to speed things up
  const fetchReviews = React.useCallback(async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setReviewData(JSON.parse(cached));
          return; // use cached data
        }
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/${hN}/${encodeURIComponent(safeFoodItem)}`
      );
      setReviewData(response.data);
      localStorage.setItem(cacheKey, JSON.stringify(response.data)); // cache latest
    } catch (error) {
      console.error("Fetch reviews failed:", error);
    }
  }, [hN, safeFoodItem, cacheKey]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, safeFoodItem]); // fetch when page loads or food item changes

  // handle form submission
  const handleSubmission = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // prevent double click
    setIsSubmitting(true);

    const trimmedReview = formData.review.trim();

    // validation
    if (!trimmedReview) {
      alert("Please enter a review before submitting.");
      setIsSubmitting(false);
      return;
    }
    if (trimmedReview.length > 300) {
      alert("Review cannot exceed 300 characters.");
      setIsSubmitting(false);
      return;
    }
    if (leoProfanity.check(trimmedReview)) {
      alert("Please avoid using offensive language.");
      setIsSubmitting(false);
      return;
    }

    try {
      // post review to backend
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/${hN}/${encodeURIComponent(safeFoodItem)}`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      // reset form after submission
      setFormData(initialState);
      setSubmitted(true);

      // invalidate local caches
      localStorage.removeItem(cacheKey); // this food’s reviews
      localStorage.removeItem(`${hN}-avgRatings`); // hall-wide avg ratings

      // refresh UI
      fetchReviews(true); // force latest reviews
      window.dispatchEvent(new Event("ratingsUpdated")); // notify other components if needed

      // allow another submission after a short delay
      setTimeout(() => setSubmitted(false), 2000);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // handle textarea or rating changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rating" ? parseFloat(value) : value,
    });
  };

  // component for star rating input
  const StarRating = () => (
    <div className="flexCenter py-2">
      <Stack spacing={1}>
        <Rating
          name="rating"
          id="rating"
          onChange={handleChange}
          value={formData.rating}
          precision={0.5}
          size="large"
        />
      </Stack>
    </div>
  );

  // component to display list of reviews
  const ReviewList = () => (
    <Row className="mt-3">
      {reviewData.reviews && reviewData.reviews.length > 0 ? (
        reviewData.reviews.map((review, index) => (
          <Col md={4} className="pb-3" key={index}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)", // subtle shadow
                minHeight: "120px",
              }}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <ReadOnlyStar r={review.rating} />
                  <div style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div style={{ color: "#333" }}>{review.comment}</div>
              </CardContent>
            </Card>
          </Col>
        ))
      ) : (
        <p>No reviews yet. be the first to leave one!</p>
      )}
    </Row>
  );

  return (
    <Container>
      <Nav />
      <div className="flexLeft">
        <BackButton to={`/${rawHN}`} />
      </div>
      <Row>
        <Col>
          <h1 className="page-header">
            {foodItem} @ {prettyHall}
          </h1>
        </Col>
      </Row>
      <hr />
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <form onSubmit={handleSubmission}>
            <textarea
              style={{
                width: "100%",
                backgroundColor: "#f9f9f9",
                color: "#333",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                fontSize: "1rem",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)", // subtle inner shadow
              }}
              onChange={handleChange}
              value={formData.review}
              name="review"
              rows="4"
              placeholder="Write your review here..."
              maxLength={300}
            />
            <p
              style={{
                fontSize: "0.85rem",
                color: "#666",
                marginTop: "5px",
                textAlign: "right",
              }}
            >
              {formData.review.length}/300
            </p>
            <StarRating />
            <div className="flexCenter">
              <button
                type="submit"
                disabled={submitted || isSubmitting}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#0F3C67",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "500",
                  cursor: submitted || isSubmitting ? "not-allowed" : "pointer",
                  marginTop: "10px",
                }}
              >
                {submitted ? "submitted" : isSubmitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </form>
        </Col>
      </Row>
      <ReviewList />
    </Container>
  );
}

export default FoodReview;
