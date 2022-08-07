<script lang="ts" setup>
import { ref, watch } from 'vue';
import { debounce } from 'throttle-debounce'

type searhcInputProps = {
    modelValue: string
    placeholder?: string
}
type searchInputEmits = {
    (e: 'update:modelValue', value: searhcInputProps['modelValue']): void
}

const props = withDefaults(defineProps<searhcInputProps>(), {
    placeholder: '请搜索歌手，歌名'
})
const emits = defineEmits<searchInputEmits>()
const query = ref(props.modelValue)

function clear () {
    query.value = ''
}

watch(query, debounce(300, (newVale: string) => {
    emits('update:modelValue', newVale)
}))

watch(() => props.modelValue, (newVale: string) => {
    query.value = newVale
})

</script>

<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input
      class="input-inner"
      v-model="query"
      :placeholder="placeholder"
    />
    <i
      v-show="query"
      class="icon-dismiss"
      @click="clear"
    ></i>
  </div>
</template>

<style lang="scss" scoped>
  .search-input {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 32px;
    background: $color-highlight-background;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: $color-text-d;
    }
    .input-inner {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      outline: 0;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-text-d;
    }
  }
</style>
