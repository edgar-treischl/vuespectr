<template>
  <v-container fluid class="pa-0">
    <div class="resizable-container">
      <!-- Left panel: Help -->
      <div
        class="left-panel"
        :style="{ width: leftWidth + 'px' }"
      >
        <v-card class="pa-4 h-100 d-flex flex-column">
          <!-- Header -->
          <div class="d-flex align-center">
            <h3 v-show="textVisible" class="text-h6">Help</h3>

            <!-- Clean chevron button -->
            <v-btn
              icon
              variant="text"
              density="compact"
              :ripple="false"
              class="chevron-btn ml-auto"
              @click="toggleText"
            >
              <v-icon>
                {{ textVisible ? 'mdi-chevron-left' : 'mdi-chevron-right' }}
              </v-icon>
            </v-btn>
          </div>

          <!-- Help text -->
          <div
            v-show="textVisible"
            class="mt-3 scrollable-text"
          >
            <p>
              This is the help text describing the visualization.
              It can contain instructions, explanations, or methodology.
            </p>
            <p>
              The panel is resizable using the divider.
              Collapse it to focus on the visualization.
            </p>
            <p>
              Longer content will scroll automatically without breaking
              the layout.
            </p>
          </div>
        </v-card>
      </div>

      <!-- Divider -->
      <div
        class="divider"
        @mousedown="startDragging"
      ></div>

      <!-- Right panel: Visualization -->
      <div
        class="right-panel"
        :style="{ width: rightWidth + 'px' }"
      >
        <v-card class="pa-4 h-100">
          <v-img
            src="https://placehold.co/600x400"
            alt="Visualization"
            contain
            height="100%"
          />
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

/* Layout state */
const textVisible = ref(true)
const defaultWidth = 400
const collapsedWidth = 40
const minLeft = 40
const maxLeft = 800
const dividerWidth = 8

const leftWidth = ref(defaultWidth)
const rightWidth = ref(window.innerWidth - leftWidth.value - dividerWidth)
const dragging = ref(false)

/* Toggle help panel */
function toggleText() {
  textVisible.value = !textVisible.value
  leftWidth.value = textVisible.value ? defaultWidth : collapsedWidth
  updateRightWidth()
}

/* Drag handling */
function startDragging(e) {
  dragging.value = true
  e.preventDefault()
}

function stopDragging() {
  dragging.value = false
}

function onDrag(e) {
  if (!dragging.value) return

  let newWidth = e.clientX
  if (newWidth < minLeft) newWidth = minLeft
  if (newWidth > maxLeft) newWidth = maxLeft

  leftWidth.value = newWidth
  updateRightWidth()

  // Auto-expand help text when dragging open
  if (newWidth > collapsedWidth) {
    textVisible.value = true
  }
}

/* Helpers */
function updateRightWidth() {
  rightWidth.value =
    window.innerWidth - leftWidth.value - dividerWidth
}

/* Lifecycle */
onMounted(() => {
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDragging)
  window.addEventListener('resize', updateRightWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDragging)
  window.removeEventListener('resize', updateRightWidth)
})
</script>

<style scoped>
/* Layout */
.resizable-container {
  display: flex;
  width: 100%;
  height: 80vh;
  overflow: hidden;
}

.left-panel,
.right-panel {
  min-width: 0;
}

/* Divider */
.divider {
  width: 8px;
  cursor: col-resize;
  background-color: #e0e0e0;
  transition: background-color 0.2s;
}

.divider:hover {
  background-color: #bdbdbd;
}

/* Scrollable help text */
.scrollable-text {
  overflow-y: auto;
  flex-grow: 1;
  padding-right: 4px;
}

/* Clean chevron button */
.chevron-btn {
  background: transparent !important;
  min-width: unset !important;
}

.chevron-btn:hover,
.chevron-btn:focus,
.chevron-btn:active {
  background: transparent !important;
}

.chevron-btn:hover v-icon {
  opacity: 0.7;
}
</style>
