<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { rendererFn } from './samples/ipc-test'

const msg = ref('initial')
rendererFn.msg((_: any, data: string) => {
  msg.value = data
})
</script>

<template>
  <div mb-10>
    <HelloWorld :msg="msg" />
  </div>
  <button
    class="check"
    b="2 solid blue-400"
    m="r-2"
    @click="rendererFn.check()"
  >
    check update (beta)
  </button>
  <button
    class="restore"
    b="2 solid red-400"
    @click="rendererFn.restore()"
  >
    restore
  </button>
</template>
