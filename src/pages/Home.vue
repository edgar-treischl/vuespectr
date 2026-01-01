<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="6">
        <v-card class="pa-6">
          <h2 class="mb-4">Welcome</h2>

          <p class="mb-6">
            Select a table and version to explore the data visualizations.
          </p>

          <v-select
            v-model="table"
            :items="tables"
            label="Table"
            class="mb-4"
          />

          <v-select
            v-model="version"
            :items="versions"
            label="Version"
            class="mb-6"
          />

          <v-btn
            color="primary"
            block
            :disabled="!table || !version"
            @click="continueToApp"
          >
            Continue
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const store = useAppStore()

const table = ref(null)
const version = ref(null)

// Example values (later can be dynamic)
const tables = ['Sales', 'Finance', 'Operations']
const versions = ['v1', 'v2', 'v3']

function continueToApp() {
  store.setSelection(table.value, version.value)
  router.push('/dashboard')
}
</script>
