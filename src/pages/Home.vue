<template>
  <v-container class="pa-8">
    <v-card elevation="6" class="mx-auto my-12" max-width="800">
      <v-card-title class="text-h5 text-center">🚀 Vue Vite Vuetify Template</v-card-title>
      <v-card-text>
        <v-divider class="my-4"></v-divider>

        <v-list dense>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-folder-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title><strong>Project Structure</strong></v-list-item-title>
              <v-list-item-subtitle>
                <code>src/</code> contains your components and main app. <br />
                <code>src/plugins/vuetify.js</code> sets up Vuetify.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-cog-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title><strong>Scripts</strong></v-list-item-title>
              <v-list-item-subtitle>
                <code>yarn dev</code> → run locally <br />
                <code>yarn build</code> → build for deployment <br />
                <code>yarn preview</code> → preview build
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-earth</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title><strong>Deployment</strong></v-list-item-title>
              <v-list-item-subtitle>
                GitHub Pages: <br />
                Make sure <code>VITE_BASE_URL</code> matches your repo name. <br />
                Example: <code>/vuetemplate/</code>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-file-document-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title><strong>Customizing</strong></v-list-item-title>
              <v-list-item-subtitle>
                - Add components in <code>src/components/</code> <br />
                - Update layouts in <code>App.vue</code> <br />
                - Modify Vuetify theme in <code>plugins/vuetify.js</code>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider class="my-4"></v-divider>

        <v-alert type="info" border="left" colored-border>
          🎯 This page serves as a starting point for anyone using this template. Copy, modify, and deploy!
        </v-alert>

        <v-card-actions class="justify-center mt-6">
          <v-btn color="primary" href="https://vitejs.dev/" target="_blank">Vite Docs</v-btn>
          <v-btn color="secondary" href="https://vuetifyjs.com/" target="_blank">Vuetify Docs</v-btn>
          <v-btn color="success" href="https://github.com/your-username/vuetemplate" target="_blank">Template Repo</v-btn>
        </v-card-actions>

      </v-card-text>
    </v-card>
  </v-container>
</template>
