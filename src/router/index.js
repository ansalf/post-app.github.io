import VueRouter from "vue-router";

//add the components
import Main from "@/components/Main";
import AddPost from "@/components/AddPost";
import Post from "@/components/Post";

export default new VueRouter({
    routes : [
        {
            path: "/",
            name: "Main",
            component: Main
        },
        {
            path: "/addpost",
            name: "AddPost",
            component: AddPost
        },
        {
            path: "/post/:id",
            name: "Post",
            component: Post
        }
    ]
});