import { useState, useEffect } from 'react';
import { useAuth } from '../utils/context/authContext';
import { deletePost, getAllPost } from '../api/PostEndpoints';
import PostCard from '../components/PostCard';

function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  // Fetch all posts when the component mounts
  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getAllPost();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div className="text-center">
      <div className="d-flex flex-column justify-content-center align-content-center" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Hello {user.fbUser.displayName}!</h1>
      </div>
      <div className="d-flex flex-wrap justify-content-center">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onDelete={deletePost} />
        ))}
      </div>
    </div>
  );
}

export default Home;
