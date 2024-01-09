import { useState, useEffect } from 'react';
import { useAuth } from '../utils/context/authContext';
import { deletePost, getAllPost } from '../api/PostEndpoints';
import PostCard from '../components/PostCard';
import { checkUser } from '../utils/auth';
import { getAllGenres, getMoviesByGenre } from '../api/GenreEndpoints';

function Home() {
  const { user } = useAuth();
  const [myUser, setMyUser] = useState();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [availableGenres, setAvailableGenres] = useState([]);

  const onUpdate = () => {
    checkUser(user.uid).then((data) => setMyUser(data[0]));
  };

  useEffect(() => {
    onUpdate();
  }, [user.uid]);

  const userId = myUser?.id;

  useEffect(() => {
    async function fetchGenres() {
      try {
        const genres = await getAllGenres();
        setAvailableGenres(genres);
      } catch (error) {
        console.error('Error fetching genres:', error.message);
      }
    }

    fetchGenres();
  }, []);

  const handleGenreChange = async (e) => {
    const genreId = e.target.value;
    setSelectedGenre(genreId);

    try {
      if (!genreId) {
        const allPosts = await getAllPost();
        setPosts(allPosts);
      } else {
        const movies = await getMoviesByGenre(genreId);
        setPosts(movies);
      }
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    }
  };

  useEffect(() => {
    if (selectedGenre) {
      getMoviesByGenre(selectedGenre);
    }
  }, [selectedGenre]);

  useEffect(() => {
    async function fetchData() {
      try {
        const postsData = await getAllPost();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    }

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPosts = posts.filter((post) => {
    const isMatchingSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    return isMatchingSearch;
  });

  return (
    <div className="text-center">
      <div className="d-flex flex-column justify-content-center align-content-center" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="btn btn-outline-secondary" type="button">Search</button>
        </div>
        <div className="input-group mb-3">
          <select
            className="form-select"
            value={selectedGenre}
            onChange={handleGenreChange}
          >
            <option value="">Filter by Genre</option>
            {availableGenres.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
          <button className="btn btn-outline-secondary" type="button">Apply</button>
        </div>
        <h1>Hello {user.fbUser.displayName}!</h1>
      </div>
      <div className="d-flex flex-wrap justify-content-center">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} onDelete={deletePost} initialUserId={userId} isWatchlistPage={false} />
        ))}
      </div>
    </div>
  );
}

export default Home;
