const dbUrl = 'https://localhost:7273';

const associateGenreWithPost = async (postId, genreId) => {
  try {
    const response = await fetch(`${dbUrl}/api/posts/${postId}/genres/${genreId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error associating genre with post');
    }

    const data = await response.json();

    console.log('Genre associated with post successfully.');

    return data;
  } catch (error) {
    throw new Error(`Error associating genre with post: ${error.message}`);
  }
};

const dissociateGenreFromPost = async (postId, genreId) => {
  try {
    const response = await fetch(`${dbUrl}/api/GenrePost?postId=${postId}&genreId=${genreId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error dissociating genre from post');
    }

    const data = await response.json();

    console.log('Genre dissociated from post successfully.');

    return data;
  } catch (error) {
    throw new Error(`Error dissociating genre from post: ${error.message}`);
  }
};

const getGenresForPost = async (postId) => {
  try {
    const response = await fetch(`${dbUrl}/api/posts/${postId}/postgenres`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching post genres');
    }

    const data = await response.json();

    console.log('Post genres fetched successfully.');

    return data;
  } catch (error) {
    throw new Error(`Error fetching post genres: ${error.message}`);
  }
};

const addToWatchlist = async (userId, postId) => {
  try {
    const response = await fetch(`${dbUrl}/api/Watchlist?userId=${userId}&postId=${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, postId }),
    });

    if (!response.ok) {
      throw new Error('Error adding post to watchlist');
    }

    const data = await response.json();

    console.log('Post added to watchlist successfully.');

    return data;
  } catch (error) {
    throw new Error(`Error adding post to watchlist: ${error.message}`);
  }
};

const removeFromWatchlist = async (userId, postId) => {
  try {
    const response = await fetch(`${dbUrl}/api/Watchlist?userId=${userId}&postId=${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error removing post from watchlist');
    }

    const data = await response.json();

    console.log('Post removed from watchlist successfully.');

    return data;
  } catch (error) {
    throw new Error(`Error removing post from watchlist: ${error.message}`);
  }
};

const getWatchlistForUser = async (userId) => {
  try {
    const response = await fetch(`${dbUrl}/api/UserWatchlist/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching user watchlist');
    }

    const data = await response.json();

    console.log('User watchlist fetched successfully.');

    return data;
  } catch (error) {
    throw new Error(`Error fetching user watchlist: ${error.message}`);
  }
};

export {
  associateGenreWithPost,
  dissociateGenreFromPost,
  getGenresForPost,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlistForUser,
};
