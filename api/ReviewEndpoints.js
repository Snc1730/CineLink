const createReview = async (reviewData) => {
  try {
    const modifiedReviewData = {
      ...reviewData,
    };

    const response = await fetch('https://localhost:7273/api/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifiedReviewData),
    });

    if (!response.ok) {
      throw new Error('Error creating review');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error creating review: ${error.message}`);
  }
};

const getReviewsByPostId = async (postId) => {
  try {
    const response = await fetch(`https://localhost:7273/api/post/${postId}/reviews`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching reviews');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching reviews: ${error.message}`);
  }
};

const getAllRatings = async () => {
  try {
    const response = await fetch('https://localhost:7273/api/ratings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching ratings');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching ratings: ${error.message}`);
  }
};

const updateReview = async (reviewId, updatedReviewData) => {
  try {
    const response = await fetch(`https://localhost:7273/api/review/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedReviewData),
    });

    if (!response.ok) {
      throw new Error('Error updating review');
    }

    return 'Review updated successfully';
  } catch (error) {
    throw new Error(`Error updating review: ${error.message}`);
  }
};

const deleteReview = async (reviewId) => {
  try {
    const response = await fetch(`https://localhost:7273/api/review/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error deleting review');
    }

    return 'Review deleted successfully';
  } catch (error) {
    throw new Error(`Error deleting review: ${error.message}`);
  }
};

export {
  createReview,
  getReviewsByPostId,
  getAllRatings,
  updateReview,
  deleteReview,
};
