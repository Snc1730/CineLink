import React, { useState, useEffect } from 'react';
import { getWatchlistForUser, removeFromWatchlist } from '../api/JoinTableEndpoints';
import PostCard from '../components/PostCard';
import { useAuth } from '../utils/context/authContext';
import { checkUser } from '../utils/auth';
import { deletePost } from '../api/PostEndpoints';

const WatchlistPage = () => {
  const { user } = useAuth();
  const [myUser, setMyUser] = useState();
  const [watchlist, setWatchlist] = useState([]);

  const onUpdate = () => {
    checkUser(user.uid).then((data) => setMyUser(data[0]));
  };

  useEffect(() => {
    onUpdate();
  }, [user.uid]);

  const userId = myUser?.id;

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        if (userId) {
          const data = await getWatchlistForUser(userId);
          setWatchlist(data);
        }
      } catch (error) {
        console.error('Error fetching user watchlist:', error);
      }
    };

    fetchWatchlist();
  }, [userId]);

  return (
    <div>
      <h1>Watchlist</h1>
      {watchlist.length === 0 ? (
        <p>No posts in watchlist</p>
      ) : (
        <div className="d-flex flex-wrap justify-content-center">
          {watchlist.map((post) => (
            <PostCard key={post.id} post={post} onDelete={deletePost} onRemove={removeFromWatchlist} initialUserId={userId} isWatchlistPage />
            // Assuming 'post' contains the necessary details to render in the PostCard
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
