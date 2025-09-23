// Displaymenu.jsx

import React from "react";
import { Link, useParams } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MealTime from "./MealTime.jsx";
import Nav from "./Nav.jsx";
import "../App.css";

import { normalizeHallName, displayHallName } from "../utils/hallNames.js";
import BackButton from "./BackButton.jsx";

function DisplayMenu({ dict }) {
  let rawHN = decodeURIComponent(useParams().hN);
  let hN = normalizeHallName(rawHN); // backend key
  let prettyName = displayHallName(hN); // user-facing

  // check if hall is closed
  const isClosed =
    !dict[hN] ||
    Object.keys(dict[hN]).length === 0 ||
    Object.values(dict[hN]).every(
      (stations) => !stations || Object.keys(stations).length === 0
    );

  return (
    <Container style={{ paddingBottom: "80px" }}>
      <Nav />

      {/* back button */}
      <div className="flexLeft">
        <BackButton to={"/"} />
      </div>

      {/* hall name header */}
      <Row>
        <Col className="pt-3">
          <h1 className="page-header">{prettyName}</h1>
        </Col>
      </Row>

      <hr />

      <Row>
        {isClosed ? (
          <Col>
            <div
              style={{
                textAlign: "center",
                marginTop: "2rem",
                fontWeight: 600,
                fontSize: "1.2rem",
                backgroundColor: "#f9f9f9",
                padding: "1rem",
                borderRadius: "8px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              {prettyName} is currently closed.
            </div>
          </Col>
        ) : (
          Object.entries(dict[hN]).map(([times, stations]) =>
            Object.keys(stations).length !== 0 ? (
              <Col md={6} lg={4} className="mb-3 px-3" key={times}>
                <MealTime time={times} sections={stations} ogHn={hN} />
              </Col>
            ) : null
          )
        )}
      </Row>
    </Container>
  );
}

export default DisplayMenu;
