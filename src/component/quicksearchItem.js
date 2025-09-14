import React from "react";
import { useNavigate } from "react-router-dom";
import '../style/home.css';
import Card from 'react-bootstrap/Card';

const Quicksearchitem = ({ QuicksearchitemData }) => {
  const navigate = useNavigate();

  const handleNavigate = (mealtypeId) => {
    const location_id = sessionStorage.getItem("id");
    if (location_id) {
      navigate(`/filter?meals=${mealtypeId}&location=${location_id}`);
    } else {
      navigate(`/filter?meals=${mealtypeId}`);
    }
  };

  const { name, content, image, mealtype_id } = QuicksearchitemData;

  return (
    <div>
      <Card
        style={{
          marginRight: "36px",
          display: "flex",
          flexWrap: 'wrap',
          width: '23rem',
          marginTop: '30px'
        }}
        onClick={() => handleNavigate(mealtype_id)}
      >
        <Card.Img src={`./${image}`} width="100px" height={150} />
        <Card.Body>
          <Card.Title style={{ fontSize: "25px", fontWeight: "bold" }}>{name}</Card.Title>
          <Card.Text>{content}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Quicksearchitem;
