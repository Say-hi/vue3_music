import { AlbumType } from '../interface'
import { get } from './base'

export function getRecommend() {
  return get('/api/getRecommend')
}

export function getAlbum(album: AlbumType) {
  return get('/api/getAlbum', {
    id: album.id
  })
}
