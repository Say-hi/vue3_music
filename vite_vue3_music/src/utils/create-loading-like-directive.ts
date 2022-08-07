import { addClass, removeClass } from "@/utils/dom"
import { Component, ComponentPublicInstance, createApp, ObjectDirective } from "vue"

const relativeCls = '.g-relative'

export default function createLoadingLikeDirective (Comp: Component) {
    function append (el: any) {
        const name = String(Comp.name)
        const style = getComputedStyle(el)
        if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
            addClass(el, relativeCls)
        }
        el.appendChild(el[name].instance.$el)
    }
    
    function remove(el: any) {
        const name = String(Comp.name)
        removeClass(el, relativeCls)
        el.removeChild(el[name].instance.$el)
    }
    const loadingDirective: ObjectDirective = {
        mounted(el, binding) {
            const app = createApp(Comp)
            const instance: ComponentPublicInstance & { setTitle?: Function } = app.mount(document.createElement('div'))
            const name = String(Comp.name || Math.random())
            if (!el[name]) {
                el[name] = {}
            }
            el[name].instance = instance
    
            const title = binding.arg
    
            if (typeof title !== 'undefined') {
                instance.setTitle?.(title)
            }
    
            if (binding.value) {
                append(el)
            }
        },
        updated(el, binding) {
            const title = binding.arg
            const name = String(Comp.name || Math.random())
            if (typeof title !== 'undefined') {
                el[name].instance.setTitle?.(title)
            }
            if (binding.value !== binding.oldValue) {
                binding.value ? append(el) : remove(el)
            }
        }
    }
    return loadingDirective
}