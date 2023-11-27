const createPost = async (postData) => {
  try {
    const modifiedPostData = {
      ...postData,
    };

    const response = await fetch('https://localhost:7273/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifiedPostData),
    });

    if (!response.ok) {
      throw new Error('Error creating post');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error creating post: ${error.message}`);
  }
};

const getAllPost = async () => {
  try {
    const response = await fetch('https://localhost:7273/api/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching post');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching post: ${error.message}`);
  }
};

const getPostById = async (id) => {
  try {
    const response = await fetch(`https://localhost:7273/api/post/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching post');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching post: ${error.message}`);
  }
};

const updatePost = async (postId, updatedPostData) => {
  try {
    const response = await fetch(`https://localhost:7273/api/post/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPostData),
    });

    if (!response.ok) {
      throw new Error('Error updating post');
    }

    return 'Post updated successfully';
  } catch (error) {
    throw new Error(`Error updating post: ${error.message}`);
  }
};

const deletePost = async (postId) => {
  try {
    const response = await fetch(`https://localhost:7273/api/post/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error deleting post');
    }

    return 'Post deleted successfully';
  } catch (error) {
    throw new Error(`Error deleting post: ${error.message}`);
  }
};

export {
  createPost,
  getAllPost,
  getPostById,
  updatePost,
  deletePost,
};
