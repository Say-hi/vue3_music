import { SingerType } from '../interface'
import { get } from './base'

export function getSingerList() {
  return get('/api/getSingerList')
}

export function getSingerDetail(singer: SingerType) {
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}
