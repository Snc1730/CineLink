import React, { useState, useEffect } from 'react';
import { getWatchlistForUser, removeFromWatchlist } from '../api/JoinTableEndpoints';
import PostCard from '../components/PostCard';
import { useAuth } from '../utils/context/authContext';
import { checkUser } from '../utils/auth';
import { deletePost } from '../api/PostEndpoints';
import { getMoviesByGenre } from '../api/GenreEndpoints';

const WatchlistPage = () => {
  const { user } = useAuth();
  const [myUser, setMyUser] = useState();
  const [watchlist, setWatchlist] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const onUpdate = () => {
    checkUser(user.uid).then((data) => setMyUser(data[0]));
  };

  useEffect(() => {
    onUpdate();
  }, [user.uid]);

  const userId = myUser?.id;

  useEffect(() => {
    const fetchWatchlistAndRecommendations = async () => {
      try {
        if (userId) {
          const watchlistData = await getWatchlistForUser(userId);
          console.log('Watchlist data:', watchlistData);
          console.log('Single watchlist item:', watchlistData[0]);
          setWatchlist(watchlistData);

          // Check if watchlistData has genres
          if (watchlistData.length > 0 && watchlistData[0].genres) {
            const watchlistGenres = watchlistData.reduce(
              (acc, movie) => [...acc, ...movie.genres.map((genre) => genre.id)],
              [],
            );
            console.log('Watchlist genres:', watchlistGenres);

            // Count occurrences of each genre ID
            const genreCounts = watchlistGenres.reduce((acc, genreId) => {
              acc[genreId] = (acc[genreId] || 0) + 1;
              return acc;
            }, {});

            console.log('Genre counts:', genreCounts);

            // Find the most common genre ID
            const mostCommonGenreId = Object.keys(genreCounts).reduce(
              (a, b) => (genreCounts[a] > genreCounts[b] ? a : b),
            );

            console.log('Most common genre ID:', mostCommonGenreId);

            if (mostCommonGenreId) {
              const matchedRecommendations = await getMoviesByGenre([mostCommonGenreId]);
              console.log('Matched recommendations:', matchedRecommendations);

              const uniqueRecommendations = matchedRecommendations.filter(
                (movie) => !watchlistData.some((watchlistMovie) => watchlistMovie.id === movie.id),
              );
              console.log('Unique recommendations:', uniqueRecommendations);

              setRecommendations(uniqueRecommendations.slice(0, 3));
            } else {
              console.error('No most common genre found.');
            }
          } else {
            console.error('Watchlist data does not have genres.');
          }
        }
      } catch (error) {
        console.error('Error fetching user watchlist:', error);
      }
    };

    fetchWatchlistAndRecommendations();
  }, [userId]);

  return (
    <div>
      <h1 className="text-center" style={{ paddingTop: '10px', paddingBottom: '10px' }}>Watchlist</h1>
      {watchlist.length === 0 ? (
        <p>No posts in watchlist</p>
      ) : (
        <div className="text-center">
          <div className="d-flex flex-wrap justify-content-center">
            {/* Render User's Watchlist */}
            {watchlist.map((post) => (
              <PostCard key={post.id} post={post} onDelete={deletePost} onRemove={removeFromWatchlist} initialUserId={userId} isWatchlistPage />
              // Assuming 'post' contains the necessary details to render in the PostCard
            ))}
          </div>

          {/* Display Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h2 style={{ paddingBottom: '10px' }}>Movies You May Enjoy</h2>
              <div className="d-flex flex-wrap justify-content-center">
                {recommendations.map((recommendedPost) => (
                  <PostCard key={recommendedPost.id} post={recommendedPost} onDelete={deletePost} />
                  // Render the recommended movie using PostCard component
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
