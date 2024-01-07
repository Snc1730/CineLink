import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { createPost, updatePost } from '../api/PostEndpoints';
import { useAuth } from '../utils/context/authContext';
import { checkUser } from '../utils/auth';
import { getAllGenres } from '../api/GenreEndpoints';
import { associateGenreWithPost, dissociateGenreFromPost, getGenresForPost } from '../api/JoinTableEndpoints';

const CreatePostForm = ({ obj }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [myUser, setMyUser] = useState();
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [length, setLength] = useState('');
  const [postGenres, setPostGenres] = useState([]);
  const [allGenres, setAllGenres] = useState([]);

  useEffect(() => {
    if (obj) {
      setTitle(obj.title || '');
      setImageUrl(obj.imageUrl || '');
      setDescription(obj.description || '');
      setLength(obj.length || '');
    }
  }, [obj]);

  const onUpdate = () => {
    checkUser(user.uid).then((data) => setMyUser(data[0]));
  };

  useEffect(() => {
    onUpdate();
  }, [user.uid]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await getAllGenres();
        setAllGenres(fetchedGenres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    if (obj) {
      const fetchPostGenres = async () => {
        try {
          const fetchedPostGenres = await getGenresForPost(obj.id);
          setPostGenres(fetchedPostGenres);
        } catch (error) {
          console.error('Error fetching post genres:', error);
        }
      };

      fetchPostGenres();
    }
  }, [obj]);

  const handleGenreCheckboxChange = async (genreId, checked) => {
    try {
      const postId = obj ? obj.id : null;

      if (checked) {
        if (postId) {
          await associateGenreWithPost(postId, genreId);
        }
        setPostGenres((prevGenres) => [...prevGenres, { id: genreId }]);
      } else {
        if (postId) {
          await dissociateGenreFromPost(postId, genreId);
        }
        setPostGenres((prevGenres) => prevGenres.filter((item) => item.id !== genreId));
      }
    } catch (error) {
      console.error('Error handling genre checkbox change:', error);
    }
  };

  const handleFormSubmit = async () => {
    try {
      const currentDate = new Date().toISOString();
      const userId = myUser?.id;

      const postData = {
        title,
        imageUrl,
        description,
        length,
        userId: parseInt(userId, 10),
      };

      if (obj) {
        const updatedPostData = { ...postData };
        await updatePost(obj.id, updatedPostData);
        console.log('Updated post:', updatedPostData);
        router.push('/');
      } else {
        const newPostData = {
          ...postData,
          DatePosted: currentDate,
        };

        const createdPost = await createPost(newPostData);

        console.log('Created post:', createdPost);

        const postId = createdPost.id;
        const selectedGenresToAssociate = allGenres
          .filter((genre) => postGenres.some((item) => item.id === genre.id))
          .map((genre) => genre.id);

        const associationPromises = selectedGenresToAssociate.map(
          async (genreId) => {
            await associateGenreWithPost(postId, genreId);
          },
        );
        await Promise.all(associationPromises);

        console.log('Genres associated with the post.');
        router.push('/');
      }
    } catch (error) {
      console.error('Error creating/updating post:', error.message);
    }
  };

  const renderGenreCheckboxes = () => allGenres.map((genre) => {
    const checked = postGenres ? postGenres.some((item) => item.id === genre.id) : false;

    return (
      <Form.Check
        key={genre.id}
        type="checkbox"
        label={genre.name}
        checked={checked}
        onChange={(e) => handleGenreCheckboxChange(genre.id, e.target.checked)}
      />
    );
  });

  return (
    <Form>
      <Form.Group controlId="formPostTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formImageUrl">
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formLength">
        <Form.Label>Length</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter length"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formGenres">
        <Form.Label>Genres</Form.Label>
        <div style={{
          display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxHeight: '200px',
        }}
        >
          {renderGenreCheckboxes()}
        </div>
      </Form.Group>

      <Button variant="primary" onClick={handleFormSubmit}>
        {obj ? 'Update Post' : 'Create Post'}
      </Button>
    </Form>
  );
};

CreatePostForm.propTypes = {
  obj: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    length: PropTypes.string,
  }),
};

CreatePostForm.defaultProps = {
  obj: null,
};

export default CreatePostForm;
