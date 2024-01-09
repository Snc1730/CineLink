import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../utils/context/authContext';
import { checkUser } from '../utils/auth';

const ReviewForm = ({ initialReview, onSubmit, postid }) => {
  const { user } = useAuth();
  const [myUser, setMyUser] = useState();
  const [reviewData, setReviewData] = useState(initialReview || { content: '', rating: 1 });

  const onUpdate = () => {
    checkUser(user.uid).then((data) => setMyUser(data[0]));
  };

  useEffect(() => {
    onUpdate();
  }, [user.uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...reviewData,
      userId: myUser.id, // Include userId in the payload
      postId: postid, // Include postId in the payload
    };
    onSubmit(payload);
    setReviewData({ content: '', rating: 1 }); // Reset the form data after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        name="content"
        placeholder="Add a review and rating!"
        value={reviewData.content}
        onChange={handleChange}
        style={{
          width: '70%',
          minHeight: '70px',
          borderRadius: '8px',
          padding: '8px',
          marginRight: '10px',
        }}
      />
      <label htmlFor="rating">Rating:</label>
      <select
        id="rating"
        name="rating"
        value={reviewData.rating}
        onChange={handleChange}
      >
        {[1, 2, 3, 4, 5].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button
        type="submit"
        style={{
          borderRadius: '8px', padding: '5px', marginLeft: '10px', marginBottom: '10px',
        }}
      >Submit
      </button>
    </form>
  );
};

ReviewForm.propTypes = {
  initialReview: PropTypes.shape({
    content: PropTypes.string,
    rating: PropTypes.number,
  }),
  onSubmit: PropTypes.func.isRequired,
  postid: PropTypes.string.isRequired,
};

ReviewForm.defaultProps = {
  initialReview: { content: '', rating: 1 },
};

export default ReviewForm;
