<template>
    <div>
      <form v-on:submit="createPost">
      <p>Fill in the form below to add a new post</p>
      
      <div class="form-control">
        <label for="title"> Post Title</label>
        <input type="text" v-model="newPost.title" id="title" placeholder="your post title" />
      </div>

      <div class="form-control">
        <label for="content"> Post Content</label>
        <textarea v-model="newPost.content" id="content" placeholder="your post content"/>
      </div>

      <div class="form-control">
        <label for="cover"> Post Cover</label>
        <input type="file" id="cover" v-on:change="handleFile"  />
      </div>

      <input type="submit" :disabled='isDisabled' value="Create Post" />
      </form>

      <p class="progress">Uploading file: {{fileProgress}} %</p>


    </div>
</template>

<script>
import firebase from "../firebase/config";
    export default {
       name: "AddPost",
       data(){
           return {
               newPost: {
                   title: "",
                   content: "",
                   cover: ""
               },
               isDisabled: false,
               fileProgress: ""
           }
       },
       methods: {
           async createPost(e){
               this.isDisabled = true;
               e.preventDefault();
             
              let d = "";
              const storageRef = firebase.storage.ref();
              const storageChild = storageRef.child(this.newPost.cover.name);
              const postCover = storageChild.put(this.newPost.cover);
              await new Promise(resolve => {
                   postCover.on("state_changed", (snapshot) => {
                        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        this.fileProgress = progress;
                    },(error) => {
                        //error
                        console.log(error);
                    },  async() => {
                        //completed
                        const downloadURL = await storageChild.getDownloadURL();
                        d = downloadURL;
                        console.log(d);
                        resolve();
                    });
              });
                let _newPost = {
                    title: this.newPost.title,
                    content: this.newPost.content,
                } 
                firebase.createPost(d, _newPost)
                .then(() => {
                    this.$router.push({name: "Main"});
                }).catch(err => console.log(err));
           
           },
           handleFile(e){
               this.newPost.cover = e.target.files[0];
           }
       }
    }
</script>