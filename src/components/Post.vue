<template>
    <div class="post-container">
        <h2>Post Details </h2>
        <hr/>

        <section>
            <img :src='postData.cover' />
            <div>
                <h3>{{postData.title}}</h3>
                <div>{{postData.content}}</div>
            </div>
        </section>

        <button class="edit" v-on:click="toggleEditMode">Open/Close Edit Panel</button>

        <div v-if="editMode">
            <p>Update the current post values using the form below </p>
          

            <form v-on:submit="updatePost" v-if="!isBusy">
                <div class="form-control">
                    <label for="title"> Post Title</label>
                    <input type="text" v-model="editPost.title" id="title" placeholder="your post title"  />
                </div>
                
                <div class="form-control">
                    <label for="content"> Post Content</label>
                    <textarea v-model="editPost.content" id="content" placeholder="your post content"/>
                </div>
                
                <div class="form-control">
                    <label for="cover"> Post Cover</label>
                    <input type="file" id="cover" v-on:change="handleFile"  />
                </div>


                <input type="hidden" id="fileref" v-model="editPost.fileref"/>
                
                <input type="submit" value="Update Post" />
            </form>

            <p class="progress" v-else>Uploading file: {{fileProgress}} %</p>   
                
            <button v-on:click="deletePost">Delete Post </button>   

        </div>
        
       
    
    </div>
</template>

<script>
import firebase from "../firebase/config";
    export default {
       name: "Post",
        data(){
            return{
                postData: {},
                postId: this.$route.params.id,
                editMode: false,
                isBusy: false,
                fileProgress: "",
                editPost: {
                    title: "",
                    content: "",
                    fileref:"",
                    cover: ""
                }
            }
        },
        created(){
            firebase.getCurrentPost(this.postId)
            .then(post => {
                this.postData = post.data();
                //set the default values for the update
                this.editPost.title = post.data().title;
                this.editPost.content = post.data().content;
                this.editPost.fileref = post.data().fileref;
              
            })
            .catch(err => console.log(err));
        },
        methods: {
            handleFile(e){
                this.editPost.cover = e.target.files[0];            
            },
            toggleEditMode(){
                this.editMode = !this.editMode;
            },
           
            async updatePost(e){
                e.preventDefault();
                this.isBusy = true;
                let _updateData = {
                    title: this.editPost.title,
                    content: this.editPost.content,
                };
                let d = "";
                if(this.editPost.cover !== ""){
                  const storageRef = firebase.storage.ref();
                  const storageChild = storageRef.child(this.editPost.cover.name);
                  const postCover = storageChild.put(this.editPost.cover);
                 
                 await new Promise(resolve => {
                    postCover.on("state_changed", (snapshot) => {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    this.fileProgress = progress;
                    }, (error) => {
                        console.log(error);
                    },
                    async() => {
                        const downloadURL = await storageChild.getDownloadURL();    
                        d = downloadURL;
                        _updateData["oldcover"] = this.postData.fileref;
                        resolve(); 
                    });
                 });
                }
                
                firebase.updatePost(d, this.postId, _updateData)
                .then(() => {
                    console.log("post has been updated");
                    this.isBusy = false;
                    this.$router.go();
                })
                .catch(err =>  console.log(err))  
            },
            deletePost(){
                firebase.deletePost(this.postId, this.postData.fileref)
                .then(() => {
                    this.$router.push({name: "Main"});
                })
                .catch((err) => console.log(err));
            }
        }
    }
</script>