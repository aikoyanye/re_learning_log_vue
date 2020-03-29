<template>
  <div class="home">
    <HelloWorld msg="HelloWorld!!!!" username="Username"/>

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'


export default {
  name: 'Home',
  data:function(){
    return {
      showLoginDialog:false
    }
  },
  components: {
    HelloWorld

  }
}
</script>
