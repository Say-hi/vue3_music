import { off } from "process";
import { ref } from "vue";

export default function useMiddleInteractive() {
  const currentShow = ref<string>("cd");
  const middleLStyle = ref({});
  const middleRStyle = ref({});
  const touch: Partial<{
    startX: number
    startY: number
    percent: number
    directionLocked: 'v' | 'h' | ''
  }> = {}
  let currentView = 'cd'

  function onMiddleTouchStart(e: TouchEvent) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLocked = ''
  }
  function onMiddleTouchMove(e: TouchEvent) {
    const delta = e.touches[0].pageX - Number(touch!.startX)
    const deltaY = e.touches[0].pageY - Number(touch!.startY)
    if (!touch.directionLocked) {
        touch.directionLocked = Math.abs(delta) >= Math.abs(deltaY) ? 'h' : 'v'
    }
    if (touch.directionLocked === 'v') return

    const left = currentView === 'cd' ? 0 : -window.innerWidth
    const offsetWidth = Math.min(0, Math.max(left + delta, -window.innerWidth))
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    if (currentView === 'cd') {
        if (touch.percent > .2) {
            currentShow.value = 'lyric'
        } else {
            currentShow.value = 'cd'
        }
    } else {
        if (touch.percent < 0.8) {
            currentShow.value = 'cd'
        } else {
            currentShow.value = 'lyric'
        }
    }
    middleLStyle.value = {
        opacity: 1 - touch.percent,
        transitionDuration: '0ms'
    }
    middleRStyle.value = {
        transform: `translate3d(${offsetWidth}px, 0, 0)`,
        transitionDuration: '0ms'
    }
  }
  function onMiddleTouchEnd(e: TouchEvent) {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
        currentView = 'cd'
        offsetWidth = 0
        opacity = 1
    } else {
        currentView ='lyric'
        offsetWidth = -window.innerWidth
        opacity = 0
    }
    const duration = 300
    middleLStyle.value = {
        opacity,
        transitionDuration: duration + 'ms'
    }
    middleRStyle.value = {
        transform: `translate3d(${offsetWidth}px, 0, 0)`,
        transitionDuration: duration + 'ms'
    }
  }
  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd,
  };
}
