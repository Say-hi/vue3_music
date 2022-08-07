<script lang='ts' setup name="BaseScroll">
import useScroll from './use-scroll'
import { ref } from "vue";

const scorllRef = ref<HTMLElement | null>(null)
const props = withDefaults(defineProps<{
    click?: boolean
    probeType?: number
}>(), {
    click: true,
    probeType: 0
})

const emits = defineEmits<{
    (e: 'scroll', data: any): void
}>()

const { scroll } = useScroll(scorllRef, props, emits)
defineExpose({
    scroll,
    props,
    emits
})
</script>

<template>
    <div ref="scorllRef">
        <slot></slot>
    </div>
</template>