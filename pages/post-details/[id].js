import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getPostById } from '../../api/PostEndpoints';
import CreatePostForm from '../../components/CreatePostForm';

const EditPostPage = () => {
  const [postData, setPostData] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchPostData = async () => {
      if (id) {
        try {
          const post = await getPostById(id); // Fetch post data by ID from your API
          console.log('Fetched post data:', post);
          setPostData(post);
        } catch (error) {
          console.error('Error fetching post data:', error);
        }
      }
    };

    fetchPostData();
  }, [id]);

  return (
    <div>
      <h2>Edit Post</h2>
      <CreatePostForm obj={postData} /> {/* Pass fetched post data to the form */}
    </div>
  );
};

export default EditPostPage;
