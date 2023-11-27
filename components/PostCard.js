import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const PostCard = ({ post, onDelete }) => {
  const handleDelete = () => {
    const confirmed = window.confirm(`Are you sure you want to delete this Post?: ${post.title}?`);

    if (confirmed) {
      onDelete(post.id)
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error deleting post:', error);
        });
    }
  };

  return (
    <div className="post-card">
      <h3>Post Title: {post.title}</h3>
      <Link href={`/post-details/${post.id}`} passHref>
        <button type="button">View Details</button>
      </Link>
      <Link href={`/edit-post/${post.id}`} passHref>
        <button type="button">Edit Post</button>
      </Link>
      <button type="button" onClick={handleDelete}>
        Delete Post
      </button>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PostCard;
