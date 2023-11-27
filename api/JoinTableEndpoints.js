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
    const response = await fetch(`/api/posts/${postId}/postgenres`, {
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

export {
  associateGenreWithPost,
  dissociateGenreFromPost,
  getGenresForPost,
};
