// PostDetailsPage.js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  createReview,
  deleteReview,
  getReviewsByPostId,
  updateReview,
} from '../../api/ReviewEndpoints';
import ReviewForm from '../../components/ReviewForm';

const PostDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    // Fetch reviews for the given id
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getReviewsByPostId(id);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  const handleCreateReview = async (reviewData) => {
    try {
      await createReview(reviewData);
      const fetchedReviews = await getReviewsByPostId(id);
      setReviews(fetchedReviews);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleUpdateReview = async (reviewId, updatedReviewData) => {
    try {
      await updateReview(reviewId, updatedReviewData);
      const fetchedReviews = await getReviewsByPostId(id);
      setReviews(fetchedReviews);
      setEditingReviewId(null); // Exit editing mode
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      const fetchedReviews = await getReviewsByPostId(id);
      setReviews(fetchedReviews);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div>
      {/* Display reviews */}
      {reviews.map((review) => (
        <div key={review.id}>
          <p>{review.content}</p>
          <button
            type="button"
            onClick={() => setEditingReviewId(review.id)}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDeleteReview(review.id)}
          >
            Delete
          </button>

          {/* Render ReviewForm when editing */}
          {editingReviewId === review.id && (
            <ReviewForm
              initialReview={review}
              onSubmit={(data) => handleUpdateReview(review.id, data)}
            />
          )}
        </div>
      ))}

      {/* Render ReviewForm for creating new review */}
      <ReviewForm
        postid={id} // Pass id to the ReviewForm
        onSubmit={handleCreateReview}
      />

    </div>
  );
};

export default PostDetailsPage;
