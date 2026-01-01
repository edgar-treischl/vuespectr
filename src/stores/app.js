import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    table: null,
    version: null
  }),

  actions: {
    setSelection(table, version) {
      this.table = table
      this.version = version
    }
  }
})
