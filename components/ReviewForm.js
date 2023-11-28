import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createReview, updateReview } from '../api/ReviewEndpoints';
import { useAuth } from '../utils/context/authContext';
import { checkUser } from '../utils/auth';

const ReviewForm = ({ postId, reviewDataToEdit }) => {
  const { user } = useAuth();
  const [reviewContent, setReviewContent] = useState('');
  const [selectedRating, setSelectedRating] = useState(1); // Assuming default rating is 1
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      checkUser(user.uid).then((data) => {
        if (data.length > 0) {
          setLoggedInUserId(data[0].id);
        }
      });
    }

    if (reviewDataToEdit && Object.keys(reviewDataToEdit).length > 0) {
      setIsEditing(true);
      setReviewContent(reviewDataToEdit.content);
      setSelectedRating(reviewDataToEdit.rating);
    }
  }, [user, reviewDataToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const reviewData = {
        postId,
        userId: loggedInUserId,
        content: reviewContent,
        rating: selectedRating,
        datePosted: new Date().toISOString(),
      };

      if (isEditing) {
        await updateReview(reviewDataToEdit.id, reviewData);
        // Handle actions after updating the review
      } else {
        await createReview(reviewData);
        // Handle actions after creating the review
      }

      console.log('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleRatingChange = (event) => {
    setSelectedRating(parseInt(event.target.value, 10));
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={reviewContent}
        onChange={(e) => setReviewContent(e.target.value)}
        placeholder="Enter your review"
      />
      <input
        type="number"
        value={selectedRating}
        onChange={handleRatingChange}
        min={1}
        max={5}
      />
      <button type="submit">{isEditing ? 'Update Review' : 'Submit Review'}</button>
    </form>
  );
};

ReviewForm.propTypes = {
  postId: PropTypes.number.isRequired,
  reviewDataToEdit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    // Add other required properties for reviewDataToEdit if any
  }),
};

ReviewForm.defaultProps = {
  reviewDataToEdit: null,
};

export default ReviewForm;
