import { ref } from "vue";
import animations from 'create-keyframe-animation'

export default function useAnimation() {
  const cdWrapperRef = ref<HTMLElement | null>(null);
  function enter(el: HTMLElement, done: any) {
    const { x, y, scale } = getPostAndScale();
    const animation = {
        0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        100: {
            transfrom: `translate3d(0,0,0) scale(1)`
        }
    }
    animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
            duration: 600,
            easing: 'cubic-bezier(0.45, 0, 0.55 ,1)'
        }
    })
    animations.runAnimation((cdWrapperRef.value as HTMLElement), 'move', done)
  }
  function afterEnter() {
    animations.unregisterAnimation('move');
    cdWrapperRef!.value!.style.animation = ''
  }
  function leave(el: HTMLElement, done: Function) {
    const {x,y,scale} = getPostAndScale()

    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl!.style.transition = 'all .5s  cubic-bezier(.45, 0, .55, 1)'
    cdWrapperEl!.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    cdWrapperEl!.addEventListener('transitionend', next)

    function next () {
        cdWrapperEl!.removeEventListener('transitionend', next)
        done()
    }

  }
  function afterLeave() {
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl!.style.transition = ''
    cdWrapperEl!.style.transform = ''
  }
  function getPostAndScale() {
    const targetWidth = 40;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8;
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    const scale = targetWidth / width;
    return {x, y, scale};
  }
  return {
    enter,
    afterEnter,
    leave,
    afterLeave,
    cdWrapperRef,
  };
}
