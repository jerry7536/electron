<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div mb-10>
    message from {{ msg }}
  </div>
  <button
    type="button"
    bg-blue-200
    @click="count++"
  >
    count is {{ count }}
  </button>
</template>
