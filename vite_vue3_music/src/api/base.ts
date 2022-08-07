import axios from 'axios'

const ERR_OK = 0

export function get (url: string, params?: any) {
    return axios.get(url, {
        params
    }).then(res => {
        const { result, code } = res.data
        if (code === ERR_OK) {
            return result
        }
    }).catch(e => {
        console.log(e)
    })
}