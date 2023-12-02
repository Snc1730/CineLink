import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const PostCard = ({
  post, onDelete, onRemove, initialUserId,
}) => {
  const [userId, setUserId] = useState(initialUserId);
  useEffect(() => {
    setUserId(initialUserId);
  }, [initialUserId]);

  const handleRemoveFromWatchlist = () => {
    const confirmed = window.confirm('Are you sure you want to remove this post from your watchlist?');

    if (confirmed) {
      onRemove(userId, post.id)
        .then(() => {
          window.location.reload(); // Or update the watchlist state after removal
        })
        .catch((error) => {
          console.error('Error removing post from watchlist:', error);
        });
    }
  };

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
      <button type="button" onClick={handleRemoveFromWatchlist}>
        Remove from Watchlist
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
  onRemove: PropTypes.func,
  initialUserId: PropTypes.number,
};

PostCard.defaultProps = {
  onRemove: () => {}, // Default function that does nothing
  initialUserId: '', // Default userId value (or any appropriate default)
};

export default PostCard;
