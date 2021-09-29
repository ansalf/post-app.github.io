<template>
    <div>
        <header>
            <div class="square"></div>
            <img src="@/assets/app_development_SVG.svg" />
            <div>
                <h1>Start building web applications with Vue &amp; Firebase</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer bibendum venenatis mi, quis tincidunt mi lobortis ut. Fusce hendrerit nunc sit amet blandit blandit. </p>
            </div>
        </header>

        <section class="posts-container">
        
            <div class="post" v-for="post in allposts" :key="post.id">
                <p class="title">{{ post.data.title  }}</p>
                <router-link :to="'/post/'+ post.id">Check Post</router-link>
                <div v-bind:style='{ backgroundImage: "url(" + post.data.cover + ")" }' class="cover" ></div>
            </div>
        
        </section>
    </div>
</template>

<script>
import firebase from "../firebase/config";
    export default {
       name: "Main",
       data(){
           return {
               allposts: []
           }
       },
       created(){
           firebase.getAllPosts()
           .then(posts => {
           
               posts.forEach(_post => {
                   let post = {
                       id: _post.id,
                       data: _post.data()
                   }
                    this.allposts.push(post);
                })
           }).catch(err => {
               console.log(err);
           })
       }
    }
</script>