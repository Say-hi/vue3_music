import { LOCAL_FAVORITE, LOCAL_HISTORY, PLAY_MODE, SongType } from '@/interface'
import { load } from '@/utils/array-storage'
import { shuffle } from '@/utils/util'
import { defineStore } from 'pinia'

type SongTypes = SongType[]

export const useStore = defineStore('main', {
    state() {
        return <{
            playList: SongTypes
            sequenceList: SongTypes
            playing: boolean
            playMode: PLAY_MODE
            currentIndex: number
            fullScreen: boolean
            favoriteList: SongTypes
            searchHistoryList: string[]
        }>{
            sequenceList: [],
            playList: [],
            playing: false,
            playMode: PLAY_MODE.sequence,
            currentIndex: 0,
            fullScreen: false,
            favoriteList: load(LOCAL_FAVORITE),
            searchHistoryList: load(LOCAL_HISTORY)
        }
    },
    getters: {
        currentSong (state) {
            return state.playList[state.currentIndex] || {}
        }
    },
    actions: {
        setPlayingState(playing: boolean) {
            this.playing = playing
        },
        setSquenceList(list: SongTypes) {
            this.sequenceList = list
        },
        setPlayList(list: SongTypes) {
            this.playList = list
        },
        setPlayMode(mode: PLAY_MODE) {
            this.playMode = mode
        },
        setCurrentIndex(index: number) {
            this.currentIndex = index
        },
        setFullScreen(fullScreen: boolean) {
            this.fullScreen = fullScreen
        },
        setFavoriteList(list: SongTypes) {
            this.favoriteList = list
        },
        selectPlay(list: SongTypes, index: number) {
            this.setPlayMode(PLAY_MODE.sequence)
            this.setSquenceList(list)
            this.setPlayingState(true)
            this.setFullScreen(true)
            this.setPlayList(list)
            this.setCurrentIndex(index)
        },
        changeMode (mode: PLAY_MODE) {
            const { id } = this.currentSong
            if (mode === PLAY_MODE.random) {
                this.setPlayList(shuffle(this.sequenceList))
            } else {
                this.setPlayList(this.sequenceList)
            }
            const currentIndex = this.playList.findIndex(i => i.id === id)
            this.setCurrentIndex(currentIndex)
            this.setPlayMode(mode)
        },
        randomPlay(list: SongTypes) {
            this.setPlayMode(PLAY_MODE.random)
            this.setSquenceList(list)
            this.setPlayingState(true)
            this.setFullScreen(true)
            this.setPlayList(shuffle<SongType>(list))
            this.setCurrentIndex(0)
        },
        removeSong(song: SongType) {
            const sequenceIndex = finIndex(this.sequenceList, song)
            const playIndex = finIndex(this.playList, song)
            if (playIndex < 0 || sequenceIndex < 0) return

            this.sequenceList.splice(sequenceIndex, 1)
            this.playList.splice(playIndex, 1)
            if(playIndex < this.currentIndex || this.currentIndex === this.playList.length) {
                this.currentIndex--
            }
            if (!this.playList.length) {
                this.setPlayingState(false)
            }
        },
        clearSongList() {
            this.setSquenceList([])
            this.setPlayList([])
            this.setCurrentIndex(0)
            this.setPlayingState(false)
        },
        addSong (song: SongType) {
            const playIndex = finIndex(this.playList, song)
            if (playIndex > -1) {
                this.currentIndex = playIndex
            } else {
                this.playList.push(song)
                this.currentIndex = this.playList.length - 1
            }

            const sequenceIndex = finIndex(this.sequenceList, song)
            if (sequenceIndex === -1) {
                this.sequenceList.push(song)
            }
            this.fullScreen = true
            this.playing = true
        }
    }
})

function finIndex<T extends SongType>(list:Array<T>, song: T) {
    return list.findIndex(i => i.id === song.id)
}