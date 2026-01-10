<template>
  <v-footer
    padless
    class="footer"
    height="80"
  >
    <v-container class="text-center">
      <span>
        Created with 
        <a href="https://gitlab.lrz.de/edgar-treischl/OddJob" target="_blank" rel="noopener" class="footer-link">🎩</a>, 
        <a href="https://vuejs.org" target="_blank" rel="noopener" class="footer-link">Vue.js</a>, and 
        <a href="https://gitlab.lrz.de/edgar-treischl/octopussy" target="_blank" rel="noopener" class="footer-link">🐙</a> | 
        By: <a href="https://edgar-treischl.de" target="_blank" rel="noopener" class="footer-link">Edgar Treischl</a>
      </span>
    </v-container>
  </v-footer>
</template>

<script setup></script>

<style scoped>
.footer {
  background-color: #f5f5f5;
  color: #333;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-link {
  text-decoration: none;
  color: #1976d2; /* Vuetify primary color */
  font-weight: 500;
  margin: 0 2px;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #004ba0; /* darker on hover */
  text-decoration: underline;
}
</style>
