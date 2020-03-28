<template>
  <d2-container>
    <el-col :span="8">
      <el-card shadow="never">
      </el-card>
    </el-col>
    <el-col :span="16">
    </el-col>
  </d2-container>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data(){
    return{

    }
  },
  mounted(){

  },
  methods:{
    ...mapActions('bootAdmin/org',['orgTreeAll'])

  }
}
</script>
<style>

</style>