import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useRouter } from 'next/router';
import { registerUser } from '../utils/auth';

function RegisterForm({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    bio: '',
    uid: user.uid,
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData, UID: user.uid, ProfileImageURL: user.fbUser.photoURL, CreatedOn: new Date(Date.now()), Active: true,
    };
    console.warn('my payload', payload);
    await registerUser(payload);
    onUpdate();
    router.push('/');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Gamer Bio</Form.Label>
        <Form.Control as="textarea" name="bio" required placeholder="Enter your Bio" onChange={({ target }) => setFormData((prev) => ({ ...prev, [target.name]: target.value }))} />
        <Form.Text className="text-muted">Let other gamers know a little bit about you...</Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

RegisterForm.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    fbUser: PropTypes.shape({
      photoURL: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default RegisterForm;
