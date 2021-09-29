import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

const config = {
    // ---> your firebase project details
}


class Firebase {

    constructor(){
        firebase.initializeApp(config);
        this.firestore = firebase.firestore();
        this.storage = firebase.storage();
    }

    getAllPosts(){
        return firebase.firestore().collection("posts").get();
    }

    getCurrentPost(postid){
        return firebase.firestore().collection("posts").doc(postid).get();
    }

    async createPost(url , post){
        const fileRef = await firebase.storage().refFromURL(url);
        let newPost = {
            title: post.title,
            content: post.content,
            cover: url,
            fileref : fileRef.location.path 
        } 

        return firebase.firestore().collection("posts").add(newPost);    
    } 

    async updatePost(url, postid, postData){
        if(url !== null && url !== ""){
            const storageRef = firebase.storage().ref();
            await storageRef.child(postData.oldcover).delete().catch(err => {
                console.log(err);
            });

            const fileRef = await firebase.storage().refFromURL(url);
            let updatedPost = {
                title: postData.title,
                content: postData.content,
                cover: url,
                fileref : fileRef.location.path
                
            }
            return firebase.firestore().collection("posts").doc(postid).set(updatedPost, {merge: true});
        }else{
            return firebase.firestore().collection("posts").doc(postid).set(postData, {merge: true});
        }
    }

    async deletePost(postid, fileref){
        const storageRef = firebase.storage().ref();
      
        await firebase.firestore().collection("posts").doc(postid).delete().catch(err => {
            console.log(err);
        });
        console.log("Post Deleted");

        await storageRef.child(fileref).delete().catch(err => {
            console.log(err);
        });
        console.log("Image Deleted");
       
    }



}

export default new Firebase();