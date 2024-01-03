const getAllGenres = async () => {
  try {
    const response = await fetch('https://localhost:7273/api/genres', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching genres');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching genres: ${error.message}`);
  }
};

const getGenreById = async (id) => {
  try {
    const response = await fetch(`https://localhost:7273/api/genre/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching genre');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching genre: ${error.message}`);
  }
};

const getMoviesByGenre = async (genreId) => {
  try {
    const response = await fetch(`https://localhost:7273/api/movies/genres/${genreId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching movies by genre');
    }

    const movies = await response.json();
    return movies;
  } catch (error) {
    throw new Error(`Error fetching movies by genre: ${error.message}`);
  }
};

const createGenre = async (genreData) => {
  try {
    const modifiedGenreData = {
      ...genreData,
    };

    const response = await fetch('https://localhost:7273/api/genre', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifiedGenreData),
    });

    if (!response.ok) {
      throw new Error('Error creating genre');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error creating genre: ${error.message}`);
  }
};

const getPostGenres = async (postId) => {
  try {
    const response = await fetch(`https://localhost:7273/api/posts/${postId}/postgenres`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching post genres');
    }

    const postGenres = await response.json();
    return postGenres;
  } catch (error) {
    throw new Error(`Error fetching post genres: ${error.message}`);
  }
};

const updateGenre = async (genreId, updatedGenreData) => {
  try {
    const response = await fetch(`https://localhost:7273/api/post/${genreId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedGenreData),
    });

    if (!response.ok) {
      throw new Error('Error updating Genre');
    }

    return 'Genre updated successfully';
  } catch (error) {
    throw new Error(`Error updating genre: ${error.message}`);
  }
};

const deleteGenre = async (genreId) => {
  try {
    const response = await fetch(`https://localhost:7273/api/genre/${genreId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error deleting genre');
    }

    return 'Genre deleted successfully';
  } catch (error) {
    throw new Error(`Error deleting genre: ${error.message}`);
  }
};

export {
  createGenre,
  getAllGenres,
  getGenreById,
  getMoviesByGenre,
  getPostGenres,
  updateGenre,
  deleteGenre,
};
