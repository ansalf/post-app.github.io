<template>

  <div id="app" class="container">
    <nav>
      <ul>
        <li><router-link to="/">VuePost</router-link></li>
      </ul>
      <ul>
        <li v-if="!addpost"><router-link to="/addpost">New Post</router-link></li>
      </ul>
    </nav>

    <router-view></router-view>
  </div>

</template>

<script>
export default{
  name:"App",
  data(){
    return{
      addpost:false
    }
  },
  match:{
    "$route":{
      handler: function(to){
        if(to.path =="/addpost"){
          this.addpost = true;
        }else{
          this.addpost = false;
        }
      },
      Immediate: true
    }
  }
}

</script>