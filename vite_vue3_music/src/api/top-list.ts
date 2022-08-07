import { get } from './base'

export function getTopList() {
  return get('/api/getTopList')
}

export interface TopType {
  id: number | string,
  period: number | string
}

export function getTopDetail(top: TopType) {
  return get('/api/getTopDetail', {
    id: top.id,
    period: top.period
  })
}
