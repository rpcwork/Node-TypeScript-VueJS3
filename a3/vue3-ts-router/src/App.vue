<template>
  <div id="nav">
    
    <router-link to="/home">Page 1</router-link> |
    <router-link to="/page2">Page 2</router-link> | 
    <router-link to="/page3">Page 3</router-link> 
    
  </div>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.btn {
  color: #fff !important;
  text-transform: uppercase;
  text-decoration: none;
  background: #ed3330;
  font-size: 30px;
  padding: 20px;
  border-radius: 5px;
  display: inline-block;
  border: none;
  transition: all 0.4s ease 0s;
}
</style>
