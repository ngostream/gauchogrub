// BackButton.jsx
import React from "react";
import { Link } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";

export default function BackButton({ to }) {
  return (
    <div style={{ marginTop: "10px", marginBottom: "15px" }}>
      <Link to={to} style={{ textDecoration: "none" }}>
        <ListItemButton
          sx={{
            width: "auto", // shrink to content
            color: "black",
            borderLeft: "6px solid #003660",
            borderRadius: "6px",
            px: 2,
            py: 0.5,
            minHeight: "auto",
            fontSize: "1rem",
            backgroundColor: "#F9F9F9",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 500,
            "&:hover": { bgcolor: "#eef3f7" },
          }}
        >
          Back
        </ListItemButton>
      </Link>
    </div>
  );
}
