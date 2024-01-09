import React from 'react';
import PropTypes from 'prop-types';

const StarRating = ({ rating }) => {
  const maxStars = 5;
  const filledStars = Math.round(rating);

  // Create an array of star elements based on the rating
  const stars = Array.from({ length: maxStars }, (_, index) => {
    if (index < filledStars) {
      return <span key={index}>★</span>;
    }
    return <span key={index}>☆</span>;
  });

  return <div>{stars}</div>;
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired, // Define the 'rating' prop type
};

export default StarRating;
