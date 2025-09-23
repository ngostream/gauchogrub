import * as React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import "../App.css";

export default function HallCard({ hN }) {
  let image = "";
  let title = "";

  // assign images and display titles
  switch (hN) {
    case "Carrillo Dining Commons":
      image = "/img/carrillo.jpeg";
      title = "Carrillo Dining Commons";
      break;
    case "De La Guerra Dining Commons":
      image = "/img/dlg.jpeg";
      title = "De La Guerra Dining Commons";
      break;
    case "Portola Dining Commons":
      image = "/img/portola.jpeg";
      title = "Portola Dining Commons";
      break;
    case "Ortega Takeout":
      image = "/img/ortega.jpeg";
      title = "Ortega Takeout";
      break;
    default:
      title = hN; // fallback to backend name if not recognized
  }

  return (
    <Link to={`/${encodeURIComponent(hN)}`} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",       // make responsive on small screens
          borderRadius: 8,     // match MealTime card radius
          overflow: "hidden",  // ensure images don't spill out
        }}
        className="hover-effect"
      >
        <CardMedia
          component="img"
          height="220"
          image={image}
          alt={title}
        />
      <CardContent>
        <h5
          style={{
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            margin: 0,
            textAlign: "center",
          }}
        >
          {title}
        </h5>
      </CardContent>
      </Card>
    </Link>
  );
}
