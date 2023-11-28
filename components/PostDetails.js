import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getPostById } from '../api/PostEndpoints';
import {
  getReviewsByPostId,
  createReview,
  deleteReview,
  updateReview,
} from '../api/ReviewEndpoints';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

const PostDetails = ({ postId, loggedInUserId }) => {
  const [post, setPost] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewToEdit, setReviewToEdit] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const postData = await getPostById(postId);
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    const fetchPostReviews = async () => {
      try {
        if (postId) {
          const reviewsData = await getReviewsByPostId(postId);
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error('Error fetching post reviews:', error);
      }
    };

    fetchPostDetails();
    fetchPostReviews();
  }, [postId]);

  const handleCreateReview = async (reviewData) => {
    try {
      const newReview = await createReview(reviewData);
      setReviews([...reviews, newReview]);
    } catch (error) {
      console.error('Error creating review:', error);
    }
  };

  const handleEditReview = (reviewId) => {
    const foundReview = reviews.find((rev) => rev.id === reviewId);
    setReviewToEdit(foundReview);
  };

  const handleUpdateReview = async (updatedReviewData) => {
    try {
      await updateReview(reviewToEdit.id, updatedReviewData);
      const updatedReviews = reviews.map((review) => (review.id === reviewToEdit.id ? { ...review, ...updatedReviewData } : review));
      setReviews(updatedReviews);
      setReviewToEdit(null);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      const filteredReviews = reviews.filter((review) => review.id !== reviewId);
      setReviews(filteredReviews);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      {/* Display other post details as needed */}
      <h2>Reviews</h2>
      {reviews.length > 0 ? (
        <>
          <ReviewList
            postId={postId}
            reviews={reviews}
            editReview={handleEditReview}
            deleteReview={handleDeleteReview}
          />
        </>
      ) : (
        <p>No reviews yet for this post.</p>
      )}
      <ReviewForm
        postId={postId}
        loggedInUserId={loggedInUserId}
        createReview={handleCreateReview}
        reviewDataToEdit={reviewToEdit}
        updateReview={handleUpdateReview}
      />
    </div>
  );
};

PostDetails.defaultProps = {
  loggedInUserId: null,
};

PostDetails.propTypes = {
  postId: PropTypes.number.isRequired,
  loggedInUserId: PropTypes.number,
};

export default PostDetails;
