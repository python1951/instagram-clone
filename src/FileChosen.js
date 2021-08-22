import { Button } from '@material-ui/core';
import {React,useState} from 'react';
import { db,storage } from "./firebase.js";
import firebase from 'firebase';
import './FileChosen.css';

function FileChosen({username}) {
const [caption, setCaption] = useState("");
const [image, setimage] = useState(null);
const [progress, setprogress] = useState(0);


const handleUpload=(e)=>{
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
        "state_changed",
        (snapshot)=>{
            const progress = Math.round(
                (snapshot.bytesTransferred/snapshot.totalBytes)*100
            );
                setprogress(progress);
        
            },
            error =>{
                console.log(error);
                alert(error.message)
            },
            ()=>{
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    db.collection('posts').orderBy('timestamp','desc').add(
                        {
                            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                            caption:caption,
                            imageUrl:url,
                            username:username,
                        }
                    );
                    setprogress(0);
                    setCaption("");
                    setimage(null);
                })
            }

    )
}

const handleChange=(e)=>{
    if (e.target.files[0]){
        setimage(e.target.files[0])
    }
}

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"/>
            <input type="text" value={caption} placeholder="Write a Caption" onChange={event=>setCaption(event.target.value)}/>

            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>Upload</Button>

        </div>
    )
}

export default FileChosen
