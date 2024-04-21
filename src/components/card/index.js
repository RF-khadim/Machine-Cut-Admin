import React from "react";
import { Link } from 'react-router-dom'
import "./styles.css";

const Card = ({ image, name, onUpdate, onDelete, isUpdating, isDeleting,key,id ,description}) => {
    console.log("dd",id)
    return (
        <div className="card" >
            <div className="d-flex j-btw align-center">
            <h3>{name}</h3>
            <p>{description}</p>
            <Link to={`/category/${id}`} >View</Link>
                
            </div>

            <img className="card-image" src={image} alt="Card" />
            <div className="card-buttons">
                <button className="card-button" onClick={onUpdate}>
                    {
                        isUpdating && key===id ? "Please wait..." : "Update"
                    }

                </button>
                <button className="card-button" onClick={onDelete}>
                    {
                        isDeleting && key===id ? "Please wait..." : "Delete"
                    }

                </button>
            </div>
        </div>
    );
};

export default Card;
