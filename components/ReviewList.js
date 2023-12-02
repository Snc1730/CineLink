import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getReviewsByPostId } from '../api/ReviewEndpoints';

const ReviewList = ({ postId, editReview, deleteReview }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getReviewsByPostId(postId);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [postId]);

  const handleEdit = (reviewId, updatedReviewData) => {
    // Assuming `updatedReviewData` is available or derived from some source
    editReview(reviewId, updatedReviewData);
  };

  const handleDeleteConfirmation = (reviewId) => {
    setReviewToDelete(reviewId);
  };

  const handleDelete = () => {
    if (reviewToDelete) {
      deleteReview(reviewToDelete);
      setReviewToDelete(null); // Reset the reviewToDelete state after deletion
    }
  };

  return (
    <div>
      <h2>Reviews for Post {postId}</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <p>User ID: {review.userId}</p>
            <p>Rating: {review.rating}</p>
            <p>Content: {review.content}</p>
            {/* Add buttons for edit and delete */}
            <button type="button" onClick={() => handleEdit(review.id, review)}>
              Edit
            </button>
            <button type="button" onClick={() => handleDeleteConfirmation(review.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {/* Confirmation Modal */}
      {reviewToDelete && (
        <div className="confirmation-modal">
          <p>Are you sure you want to delete this review?</p>
          <button type="button" onClick={handleDelete}>
            Yes
          </button>
          <button type="button" onClick={() => setReviewToDelete(null)}>
            No
          </button>
        </div>
      )}
    </div>
  );
};

ReviewList.propTypes = {
  postId: PropTypes.number.isRequired,
  editReview: PropTypes.func.isRequired,
  deleteReview: PropTypes.func.isRequired,
};

export default ReviewList;
