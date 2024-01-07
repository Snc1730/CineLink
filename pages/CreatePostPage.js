import React from 'react';
import CreatePostForm from '../components/CreatePostForm';

const CreatePostPage = () => (
  <div className="container">
    <h1 className="text-center" style={{ paddingTop: '10px' }}>Share A New Movie!</h1>
    <CreatePostForm />
  </div>
);

export default CreatePostPage;
