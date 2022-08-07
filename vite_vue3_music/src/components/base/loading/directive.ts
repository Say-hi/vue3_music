// import { addClass, removeClass } from "@/utils/dom"
// import { ComponentPublicInstance, createApp, ObjectDirective } from "vue"
import Loading from './loading.vue'
import createLoadingLikeDirective from '@/utils/create-loading-like-directive'
export default createLoadingLikeDirective(Loading)
// const relativeCls = '.g-relative'

// const loadingDirective: ObjectDirective = {
//     mounted(el, binding) {
//         const app = createApp(Loading)
//         const instance: ComponentPublicInstance & { setTitle?: Function } = app.mount(document.createElement('div'))
//         el.instance = instance

//         const title = binding.arg

//         if (typeof title !== 'undefined') {
//             instance.setTitle?.(title)
//         }

//         if (binding.value) {
//             append(el)
//         }
//     },
//     updated(el, binding) {
//         const title = binding.arg

//         if (typeof title !== 'undefined') {
//             el.instance.setTitle?.(title)
//         }
//         if (binding.value !== binding.oldValue) {
//             binding.value ? append(el) : remove(el)
//         }
//     }
// }

// function append (el: any) {
//     const style = getComputedStyle(el)
//     if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
//         addClass(el, relativeCls)
//     }
//     el.appendChild(el.instance.$el)
// }

// function remove(el: any) {
//     removeClass(el, relativeCls)
//     el.removeChild(el.instance.$el)
// }

// export default loadingDirective