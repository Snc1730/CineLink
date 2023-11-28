import { useRouter } from 'next/router';
import PostDetails from '../../components/PostDetails';

const PostDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <div>Loading...</div>; // Or any loading indicator while postId is undefined
  }

  return (
    <div>
      <h1>Post Details Page</h1>
      <PostDetails postId={parseInt(id, 10)} /> {/* Pass postId to PostDetails component */}
    </div>
  );
};

export default PostDetailsPage;
