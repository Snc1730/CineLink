import React, { useState, useEffect } from 'react';
import { getAllRatings } from '../api/ReviewEndpoints';
import { deletePost, getPostById } from '../api/PostEndpoints';
import PostCard from '../components/PostCard';
import { checkUser } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';

function Top10Page() {
  const { user } = useAuth();
  const [myUser, setMyUser] = useState();
  const [topMovies, setTopMovies] = useState([]);

  const onUpdate = () => {
    checkUser(user.uid).then((data) => setMyUser(data[0]));
  };

  useEffect(() => {
    onUpdate();
  }, [user.uid]);

  const userId = myUser?.id;

  useEffect(() => {
    async function fetchTopMovies() {
      try {
        const ratings = await getAllRatings();

        // Group ratings by postId
        const ratingsByPostId = {};
        ratings.forEach(({ postId, rating }) => {
          if (!ratingsByPostId[postId]) {
            ratingsByPostId[postId] = { totalRatings: 0, sumOfRatings: 0 };
          }
          ratingsByPostId[postId].totalRatings += 1;
          ratingsByPostId[postId].sumOfRatings += rating;
        });

        // Filter and calculate average ratings for posts with at least 5 ratings
        const filteredTopMovies = Object.entries(ratingsByPostId)
          // eslint-disable-next-line no-unused-vars
          .filter(([_postId, { totalRatings }]) => totalRatings >= 5)
          .map(([postId, { totalRatings, sumOfRatings }]) => {
            const averageRating = sumOfRatings / totalRatings;
            return { postId, averageRating };
          })
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 10);

        const moviesDetails = await Promise.all(
          filteredTopMovies.map(async ({ postId }) => {
            const movieDetails = await getPostById(postId);
            return { ...movieDetails, averageRating: ratingsByPostId[postId].averageRating };
          }),
        );

        setTopMovies(moviesDetails);
      } catch (error) {
        console.error('Error fetching top 10 movies:', error.message);
      }
    }

    fetchTopMovies();
  }, []);

  return (
    <div className="container">
      <div className="row">
        {topMovies.map((movie, index) => (
          <div className="col-lg-6 col-xl-4 mb-4" key={movie.id}>
            <div className="top-movie-card position-relative">
              <PostCard
                post={movie}
                onDelete={deletePost}
                initialUserId={userId}
                isWatchlistPage={false}
                isTop10Page
              />
              <div
                className="position-absolute bottom-0 start-50 translate-middle-x bg-dark py-2 px-3 rounded-pill"
                style={{ zIndex: 1 }}
              >
                <h3 className="m-0">{index + 1}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top10Page;
