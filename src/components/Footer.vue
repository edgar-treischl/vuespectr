<template>
  <v-footer
    padless
    class="footer"
    height="80"
  >
    <v-container class="text-center">
      <span>
        Created with 
        <a href="https://example.com/magic-hat" target="_blank" rel="noopener" class="footer-link">🎩</a>, 
        <a href="https://example.com/shiny" target="_blank" rel="noopener" class="footer-link">shiny</a>, and 
        <a href="https://example.com/octopus" target="_blank" rel="noopener" class="footer-link">🐙</a> | 
        By: <a href="https://github.com/edgartreischl" target="_blank" rel="noopener" class="footer-link">Edgar Treischl</a>
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
