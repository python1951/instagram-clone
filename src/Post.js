import React, { useEffect, useState } from "react";
import { Avatar, Button } from "@material-ui/core";
import { db } from "./firebase.js";
import firebase  from "firebase";

import "./Post.css";
function Post({ postId,user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp",'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
        text:comment,
        username:user.displayName,
        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
    })
    setComment("");


  };
  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar
          className='post__avatar'
          alt={username}
          src='/static/images/1.jpg'
        />

        <h5> {username} </h5>
      </div>

      <img className='post__image' src={imageUrl} alt='Post' />
      <h5 className='post__text'>
        <strong>{username} :</strong>
        {caption}
      </h5>

      <div className='post__comments'>
        {comments.map((comment,any) => (
          <p>
            <strong>{comment.username}</strong>
            {comment.text}
          </p>
        ))}
      </div>

     {
         user&&(
            <form className='post__commentBox'>
            <input
              className='post__input'
              type='text'
              value={comment}
              placeholder='Add a Comment'
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              type='submit'
              onClick={postComment}
              className='post__button'
              disabled={!comment}>
              Post
            </Button>
          </form>
         )
     }
    </div>
  );
}

export default Post;
