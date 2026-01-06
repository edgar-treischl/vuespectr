<template>
  <v-app-bar app color="white" elevate-on-scroll>
    <!-- Mobile menu icon -->
    <v-app-bar-nav-icon v-if="smAndDown" @click="drawer = !drawer" />

    <!-- Logo -->
    <v-toolbar-title>
      <router-link to="/" class="flex items-center cursor-pointer">
        <img :src="logoSrc" alt="App Icon" class="app-icon" />
      </router-link>
    </v-toolbar-title>

    <v-spacer />

    <!-- Desktop Navigation -->
    <template v-if="mdAndUp">
      <v-btn
        v-for="item in navItems"
        :key="item.to"
        text
        :to="item.to"
        :class="{ 'active-link': $route.path === item.to }"
      >
        <v-icon left>{{ item.icon }}</v-icon>
        {{ item.label }}
      </v-btn>
    </template>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" temporary location="left">
    <v-list nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        @click="drawer = false"
        :active="$route.path === item.to"
        class="mobile-nav-item"
      >
        <template #prepend>
          <v-icon size="28">{{ item.icon }}</v-icon>
        </template>
        <v-list-item-title class="mobile-nav-title">
          {{ item.label }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

// Mobile drawer state
const drawer = ref(false)

// Vuetify breakpoints
const { smAndDown, mdAndUp } = useDisplay()

// Logo path
const logoSrc = import.meta.env.BASE_URL + 'images/vite.svg'

// Navigation items
const navItems = [
  { label: 'Overview', to: '/overview', icon: 'mdi-view-dashboard' },
  { label: 'Pipe', to: '/pipe', icon: 'mdi-pipe' },
  { label: 'Validation', to: '/validation', icon: 'mdi-check' },
  { label: 'Variables', to: '/variables', icon: 'mdi-database' },
  { label: 'Classes', to: '/classes', icon: 'mdi-shape' },
  { label: 'Labels', to: '/labels', icon: 'mdi-tag-multiple' },
]
</script>

<style scoped>
.app-icon {
  width: 40px;
  height: 40px;
  transition: transform 0.3s;
}

.app-icon:hover {
  transform: scale(1.1);
}

.v-btn {
  padding: 8px 16px;
  color: #5f6368;
}

.v-btn:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.active-link {
  background-color: rgba(0, 0, 0, 0.1);
}

.mobile-nav-item {
  min-height: 56px;
  padding-left: 16px;
  padding-right: 16px;
}

.mobile-nav-title {
  font-size: 18px;
  margin-left: 8px;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.v-navigation-drawer {
  width: 240px;
}
</style>
