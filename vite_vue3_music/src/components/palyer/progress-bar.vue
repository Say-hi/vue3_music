<script lang="ts" setup>
import { off } from "process";
import { ref, watch, computed, reactive } from "vue";
const progressBtnWidth = 16;
interface PropsType {
  progress: number;
}
interface touchType {
  x1: number
  beginWidth: number
}

const props = withDefaults(defineProps<PropsType>(), {
  progress: 0,
});
const emits = defineEmits<{
  (e: 'progressChanging', progress: number): void
  (e: 'progressChanged', progress: number): void
}>()

const progressBarRef = ref<HTMLDivElement | null>(null);
const progressRef = ref<HTMLDivElement | null>(null);
const offset = ref(0);
const touch = reactive<touchType>({
  x1: 0,
  beginWidth: 0
})

function handleTouchStart (e: TouchEvent) {
    touch.x1 = e.touches[0].pageX
    touch.beginWidth = progressRef.value!.clientWidth
}
function handleTouchMove (e: TouchEvent) {
    const delta = e.touches[0].pageX - (touch!.x1)
    const tempWidth = touch.beginWidth + delta
    const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth
    const progess = Math.min(1, Math.max(tempWidth / barWidth, 0))
    offset.value = barWidth * progess
    emits('progressChanging', progess)
}
function handleTouchEnd (e: TouchEvent) {
  const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth
  const progress = progressRef.value!.clientWidth / barWidth
  emits('progressChanged', progress)
}
function handleClick (e: MouseEvent) {
  const progressRefTemp = progressBarRef.value
  const progress = (e.pageX - progressRefTemp!.offsetLeft) / progressRefTemp!.clientWidth
  emits('progressChanged', progress)
}
function offsetProgress (newVal: number) {
  const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth;
  offset.value = barWidth * newVal;
}

const progressStyle = computed(() => {
  return `width: ${offset.value}px;`;
});
const btnStyle = computed(() => {
  return `transform: translate3d(${offset.value}px, 0, 0);`;
});

watch(
  () => props.progress,
  (newVal) => {
    offsetProgress(newVal)
  }
);

defineExpose({
  offsetProgress
})

</script>
<template>
  <div class="progress-bar" ref="progressBarRef" @click="handleClick">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle" ref="progressRef"></div>
      <div class="progress-btn-wrapper">
        <div
          class="progress-btn"
          :style="btnStyle"
          @touchstart.prevnet="handleTouchStart"
          @touchmove.prevent="handleTouchMove"
          @touchend.prevent="handleTouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
