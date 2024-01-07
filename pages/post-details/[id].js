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
import { addToWatchlist, getGenresForPost } from '../../api/JoinTableEndpoints';
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
  const [showConfirmation, setShowConfirmation] = useState(false); // State for showing the confirmation
  const [postGenres, setPostGenres] = useState([]);

  const onUpdate = () => {
    checkUser(user.uid).then((data) => setMyUser(data[0]));
  };

  useEffect(() => {
    onUpdate();
  }, [user.uid]);

  useEffect(() => {
    const fetchPostGenres = async () => {
      try {
        const genres = await getGenresForPost(id);
        setPostGenres(genres);
      } catch (error) {
        console.error('Error fetching post genres:', error);
      }
    };

    if (id) {
      fetchPostGenres();
    }
  }, [id]);

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
      await addToWatchlist(parseInt(userId, 10), id);
      setShowConfirmation(true); // Show confirmation message
      setTimeout(() => {
        setShowConfirmation(false); // Hide confirmation message after 3 seconds
      }, 3000);
    } catch (error) {
      console.error('Error adding post to watchlist:', error.message);
      // Handle the error and display an error message or perform other actions as needed
    }
  };

  return (
    <div className="custom-width-container" style={{ paddingTop: '10px', paddingBottom: '10px', display: 'flex' }}>
      {/* Left Column */}
      <div style={{
        flex: '1', paddingRight: '20px', position: 'sticky', top: '0', height: '100vh', overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}
      >
        {/* Display post details */}
        <h1>Title: {postDetails.title}</h1>
        {postDetails.imageUrl && (
          <img
            src={postDetails.imageUrl}
            alt={postDetails.title}
            style={{ maxWidth: '500px', height: 'auto' }}
          />
        )}

        {/* Add to Watchlist Button */}
        <button type="button" onClick={handleAddToWatchlist} className="button">
          Add to Watchlist
        </button>

        {/* Confirmation message */}
        {showConfirmation && (
          <div className="confirmation">
            <p>Post added to watchlist successfully!</p>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div style={{ flex: '1', overflow: 'auto' }}>
        {/* Description */}
        <h3 style={{ marginTop: '150px' }}>{postDetails.description}</h3>
        <p>Length: {postDetails.length}</p>

        {/* Display genres */}
        <div>
          <h2>Genres</h2>
          <ul>
            {postGenres.map((genre) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>
        </div>

        {/* ReviewForm for creating new review */}
        <ReviewForm
          postid={id}
          onSubmit={handleCreateReview}
        />

        {/* Reviews Section */}
        {reviews.slice(0).reverse().map((review) => (
          <div key={review.id}>
            <p>{review.content}</p>
            <p>{review.rating}</p>
            {myUser?.id === review.userId && (
              <>
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
              </>
            )}
            {editingReviewId === review.id && (
              <ReviewForm
                postid={id}
                initialReview={review}
                onSubmit={(data) => handleUpdateReview(review.id, data)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetailsPage;
