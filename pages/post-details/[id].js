import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, ListGroup } from 'react-bootstrap';
import {
  createReview,
  deleteReview,
  getReviewsByPostId,
  getUserById,
  updateReview,
} from '../../api/ReviewEndpoints';
import ReviewForm from '../../components/ReviewForm';
import { getPostById } from '../../api/PostEndpoints';
import { addToWatchlist, getGenresForPost } from '../../api/JoinTableEndpoints';
import { checkUser } from '../../utils/auth';
import { useAuth } from '../../utils/context/authContext';
import StarRating from '../../components/StarRating';

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
        const reviewsWithUserData = await Promise.all(
          fetchedReviews.map(async (review) => {
            const userData = await getUserById(review.userId);
            console.log('User data:', userData);
            return { ...review, userData };
          }),
        );
        setReviews(reviewsWithUserData);
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
      // Create the review
      await createReview(reviewData);

      // Fetch the newly added review and its user data
      const newReviews = await getReviewsByPostId(id);
      const reviewsWithUserData = await Promise.all(
        newReviews.map(async (review) => {
          const userData = await getUserById(review.userId);
          return { ...review, userData };
        }),
      );

      // Update the reviews state to include the new review with user data
      setReviews(reviewsWithUserData);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleUpdateReview = async (reviewId, updatedReviewData) => {
    try {
      // Update the review
      await updateReview(reviewId, updatedReviewData);

      // Fetch the updated reviews and their user data
      const updatedReviews = await getReviewsByPostId(id);
      const reviewsWithUserData = await Promise.all(
        updatedReviews.map(async (review) => {
          const userData = await getUserById(review.userId);
          return { ...review, userData };
        }),
      );

      // Update the reviews state with the updated data
      setReviews(reviewsWithUserData);
      setEditingReviewId(null); // Exit editing mode
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      // Delete the review
      await deleteReview(reviewId);

      // Fetch the updated reviews and their user data after deletion
      const updatedReviews = await getReviewsByPostId(id);
      const reviewsWithUserData = await Promise.all(
        updatedReviews.map(async (review) => {
          const userData = await getUserById(review.userId);
          return { ...review, userData };
        }),
      );

      // Update the reviews state with the updated data after deletion
      setReviews(reviewsWithUserData);
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
            <p>Film added to watchlist!</p>
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
        <ListGroup style={{ backgroundColor: '#333' }}>
          {reviews.slice(0).reverse().map((review) => (
            <ListGroup.Item key={review.id} style={{ backgroundColor: '#111', color: 'inherit' }}>
              {/* Display user information */}
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{review.userData.name}</h5>
              </div>
              <p className="mb-1">{review.content}</p>
              {/* Star Rating component */}
              <StarRating rating={review.rating} />
              {/* Update background color of buttons to match the body color */}
              {myUser?.id === review.userId && (
              <div>
                <Button variant="info" style={{ backgroundColor: 'inherit', border: 'none', color: 'inherit' }} onClick={() => setEditingReviewId(review.id)}>
                  Edit
                </Button>
                <Button variant="danger" style={{ backgroundColor: 'inherit', border: 'none', color: 'inherit' }} onClick={() => handleDeleteReview(review.id)}>
                  Delete
                </Button>
              </div>
              )}
              {editingReviewId === review.id && (
              <ReviewForm
                postid={id}
                initialReview={review}
                onSubmit={(data) => handleUpdateReview(review.id, data)}
              />
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default PostDetailsPage;
