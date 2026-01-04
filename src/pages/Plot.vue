<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="8">
        <PresenceMatrixChart />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import PresenceMatrixChart from "@/components/PresenceMatrixChart.vue"
</script>
