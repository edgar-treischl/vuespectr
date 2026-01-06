import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    table: null,
    version: null
  }),

  actions: {
    // set default only if store is empty
    setDefault(table, version) {
      if (!this.table) this.table = table
      if (!this.version) this.version = version
    },

    // set user selection (always overrides)
    setSelection(table, version) {
      this.table = table
      this.version = version
    }
  }
})
