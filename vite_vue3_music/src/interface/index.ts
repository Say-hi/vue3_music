export interface AlbumType {
    id: number
    pic: string
    title: string
    username: string
    name: string
}

export interface SingerType {
    id: number
    pic: string
    name: string
    mid: string
}

export interface SingerListType {
    mid: number | string
    title: string
    list: Array<SingerType>
}

export interface SongType {
    mid: number
    lyric: string
    url: string
    name: string
    id: string | number
    pic: string
    singer: string,
    duration?: number
    songName?: string
    singerName?: string
}

export interface LyricMapType {
    [k: number | string]: string
}

export interface SliderType {
    link: string
    pic: string
    id: string
}

export interface TopListTypeItem {
    id: number | string
    pic: string
    songList: SongType[]
}

export enum PLAY_MODE {
    'sequence',
    'loop',
    'random'
}

export interface HotKeyType {
    id: number
    key: string
}

export const LOCAL_SINGER = '__LOCAL_SINGER__'
export const LOCAL_FAVORITE = '__LOCAL_FAVORITE__'
export const LOCAL_ALBUM = '__LOCAL_ALBUM__'
export const TOP_KEY = '__TOP_KEY__'
export const LOCAL_HISTORY = '__LOCAL_HISTORY__'
