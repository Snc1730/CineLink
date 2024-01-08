/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import {
  Navbar, //
  Container,
  Nav,
  Button,
} from 'react-bootstrap';
import { signOut } from '../utils/auth';

export default function NavBar() {
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      variant="dark"
      className="custom-navbar"
      style={{
        backgroundColor: '#0e141b',
      }}
    >
      <Container>
        <Link passHref href="/">
          <Navbar.Brand className="navbar-brand">CHANGE ME</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link passHref href="/">
              <Nav.Link className="nav-link">Films</Nav.Link>
            </Link>
            <Link passHref href="/CreatePostPage">
              <Nav.Link className="nav-link">Add New Post</Nav.Link>
            </Link>
            <Link passHref href="/topRatedPage">
              <Nav.Link className="nav-link">Top Rated Films</Nav.Link>
            </Link>
            <Link passHref href="/watchlist">
              <Nav.Link className="nav-link">Watchlist</Nav.Link>
            </Link>
            <Button
              onClick={signOut}
              className="button"
              style={{
                backgroundColor: 'transparent', border: 'none', color: '#8098c0', textDecoration: 'none', fontFamily: 'Arial', fontWeight: 'bold', cursor: 'pointer',
              }}
            >
              Sign Out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
