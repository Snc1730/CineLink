import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  createReview,
  deleteReview,
  getReviewsByPostId,
  updateReview,
} from '../../api/ReviewEndpoints';
import ReviewForm from '../../components/ReviewForm';
import { getPostById } from '../../api/PostEndpoints';
import { addToWatchlist } from '../../api/JoinTableEndpoints';
import { checkUser } from '../../utils/auth';
import { useAuth } from '../../utils/context/authContext';

const PostDetailsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [myUser, setMyUser] = useState();
  const { id } = router.query;
  const [postDetails, setPostDetails] = useState({});
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const onUpdate = () => {
    checkUser(user.uid).then((data) => setMyUser(data[0]));
  };

  useEffect(() => {
    onUpdate();
  }, [user.uid]);

  useEffect(() => {
    // Fetch post details for the given id
    const fetchPostDetails = async () => {
      try {
        const postDetailsData = await getPostById(id); // Use your getPostById function here
        setPostDetails(postDetailsData); // Update state with fetched post details
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

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
      fetchPostDetails();
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

  const handleAddToWatchlist = async () => {
    try {
      const userId = myUser?.id;
      console.log('userId', userId);
      console.log('postId', id);
      await addToWatchlist(parseInt(userId, 10), id);
      // Update the UI accordingly (set a flag, show a success message, etc.)
      console.log('Post added to watchlist successfully.');
    } catch (error) {
      console.error('Error adding post to watchlist:', error.message);
      // Handle the error and display an error message or perform other actions as needed
    }
  };

  return (
    <div>
      {/* Display post details */}
      <h1>{postDetails.title}</h1>
      <p>{postDetails.description}</p>
      <p>Length: {postDetails.length}</p>

      {/* Add to Watchlist Button */}
      <button type="button" onClick={handleAddToWatchlist}>
        Add to Watchlist
      </button>

      {/* Display reviews */}
      {reviews.map((review) => (
        <div key={review.id}>
          <p>{review.content}</p>
          <p>{review.rating}</p>
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
              postid={id}
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
