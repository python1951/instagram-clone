import "./App.css";
import React, { useState, useEffect } from "react";
import Post from "./Post";
import InstagramEmbed from "react-instagram-embed";
import { makeStyles } from "@material-ui/core/styles";
import { db, auth } from "./firebase.js";

import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import FileChosen from "./FileChosen";
function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [opensignin, setopensignin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  function rand() {
    return Math.round(Math.random() * 20) - 10;
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  useEffect(() => {
    db.collection("posts").onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        })),
      );
    });
  }, []);

  const signIn = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      alert(error.message);
    });
    setopensignin(false);
  };
  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })

      .catch((error) => alert(error.message));
  };

  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const classes = useStyles();
  return (
    <div className='app'>
      <div className='app__header'>
        <img
          className='app__headerimage'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png'
          alt='instagram_header'
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Sign-out</Button>
        ) : (
          <div>
            <Button onClick={() => setopensignin(true)}>Sign-In</Button>
            <Button onClick={() => setOpen(true)}>Sign-up</Button>
          </div>
        )}
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <img
            className='app__image'
            src='https://static.xx.fbcdn.net/rsrc.php/yM/r/ol4auRObwID.svg'
            alt='instagram-logo'
          />

          <form className='app__form'>
            <center>
              <Input
                placeholder='Email'
                type='text'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <br></br>

              <Input
                placeholder='Username'
                type='text'
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <br></br>
              <Input
                placeholder='Password'
                type='password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <br></br>
              <Button onClick={signUp}>Sign-up</Button>
            </center>
          </form>
        </div>
      </Modal>

      <Modal open={opensignin} onClose={() => setopensignin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <img
            className='app__image'
            src='https://static.xx.fbcdn.net/rsrc.php/yM/r/ol4auRObwID.svg'
            alt='instagram-logo'
          />

          <form className='app__form'>
            <center>
              <Input
                placeholder='Email'
                type='text'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <br></br>

              <br></br>
              <Input
                placeholder='Password'
                type='password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <br></br>
              <Button onClick={signIn}>Sign-in</Button>
            </center>
          </form>
        </div>
      </Modal>

      <h2>Hello Porgrammers! Welcome to instagram clone!</h2>
      <div className='app__posts'>
        <div className='app__postsleft'>
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>

        <div className='app__postsright'>
          <InstagramEmbed
            url='https://www.instagram.com/q_awais07/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <FileChosen username={user.displayName} />
      ) : (
        <h3>Need to Login</h3>
      )}
    </div>
  );
}

export default App;
