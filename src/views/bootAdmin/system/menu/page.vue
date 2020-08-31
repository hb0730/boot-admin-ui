<template>
  <d2-container class="page">
    <el-col :span="6">
      <el-card shadow="never">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" size="medium" icon="el-icon-plus" plain>添加</el-button>
            <el-button type="danger" size="medium" icon="el-icon-delete" plain>删除</el-button>
          </el-col>
        </el-row>
        <el-row style="padding-top:10%;">
          <el-col></el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card shadow="never">
        <el-row></el-row>
        <el-row style="padding-top:10%;">
          <el-col></el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="10">
      <el-card shadow="never">
        <el-row>
          <el-col></el-col>
        </el-row>
      </el-card>
    </el-col>
  </d2-container>
</template>
<script>
</script>