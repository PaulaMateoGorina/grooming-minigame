/* eslint-disable @typescript-eslint/no-var-requires */
import { SOUND_PATHS } from './constants';
import { LogLevel, WriteLog } from './logger'
import { gameStore } from '@/gameStore';

class SoundManager{
    private static instance: SoundManager | null
    private audiosPlaying: HTMLAudioElement[];
    private availableSoundEffects: HTMLAudioElement[];

    constructor(){
        this.audiosPlaying = [];
        this.availableSoundEffects = [];

        for(const soundPath of SOUND_PATHS){
            const audio = new Audio(require(`@/assets/audio/${soundPath}`));
            this.availableSoundEffects.push(audio);
        }
    }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }
    

    public async playSoundEffect(audioIdx: number, loop?: boolean): Promise<void>{
        let result = undefined;
        try {
            if(audioIdx === null || audioIdx === undefined || isNaN(audioIdx)){
                throw new Error("Sound was null, undefined or non-numerical");
            }

            result = new Promise<void>((resolve) => {
                // audio ready to be played
                if(this.availableSoundEffects[audioIdx].readyState >= 3){
                    this.availableSoundEffects[audioIdx].play();
                    if(loop)
                        this.availableSoundEffects[audioIdx].loop = loop;
                    
                    this.audiosPlaying.push(this.availableSoundEffects[audioIdx]);

                    // If game is muted, volume to 0 -> allows users to mute / unmute mid sound play
                    if(gameStore.getters.isMuted){
                        this.availableSoundEffects[audioIdx].volume = 0;
                    }
                    this.availableSoundEffects[audioIdx].onended = () =>{
                        this.audiosPlaying = this.audiosPlaying.filter(audioPlaying => audioPlaying !== this.availableSoundEffects[audioIdx]);
                        resolve();
                    }
                }
                // Else, wait for it to be loaded
                else{
                    this.availableSoundEffects[audioIdx].oncanplaythrough = () => {
                        this.playSound(this.availableSoundEffects[audioIdx], (loop !== null && loop !== undefined) ? loop : false);
                    }
                }
            })
        } 
        catch (error) {
            WriteLog("SoundManager.ts > playSoundEffect > #ERROR: " + error, LogLevel.ERROR);
        }
        return result;
    }

    public async playSound(audio: HTMLAudioElement, loop?: boolean): Promise<void>{
        let result = undefined;

        try {
            if(audio === null || audio === undefined){
                throw new Error("Audio was null or undefined");
            }

            result =  new Promise<void>((resolve) => {
                // audio ready to be played
                if(audio.readyState >= 3){
                    audio.play();
                    if(loop)
                        audio.loop = loop;
                    
                    this.audiosPlaying.push(audio);

                    // If game is muted, volume to 0 -> allows users to mute / unmute mid sound play
                    if(gameStore.getters.isMuted){
                        audio.volume = 0;
                    }
                    audio.onended = () =>{
                        this.audiosPlaying = this.audiosPlaying.filter(audioPlaying => audioPlaying !== audio);
                        resolve();
                    }
                }
                // Else, wait for it to be loaded
                else{
                    audio.oncanplaythrough = () => {
                        this.playSound(audio, (loop !== null && loop !== undefined) ? loop : false);
                    }
                }
            })
        }
        catch(error){
            WriteLog("SoundManager.ts > playSound > #ERROR: " + error, LogLevel.ERROR);
        }
        return result
    }

    public mute():void{
        try {
            for(const audio of this.audiosPlaying){
                audio.volume = 0;
            }
        } 
        catch (error) {
            WriteLog("SoundManager.ts > mute > #ERROR: " + error, LogLevel.ERROR);
            
        }
    }

    public unmute():void{
        try {
            for(const audio of this.audiosPlaying){
                audio.volume = 1;
            }
        } 
        catch (error) {
            WriteLog("SoundManager.ts > unmute > #ERROR: " + error, LogLevel.ERROR);
        }
    }

    public stopSounds():void{
        try {
            for(const audio of this.audiosPlaying){
                audio.pause();
                audio.currentTime = 0;
            }
            this.audiosPlaying = [];
        } 
        catch (error) {
            WriteLog("SoundManager.ts > stopSounds > #ERROR: " + error, LogLevel.ERROR);
        }
    }
}

export default SoundManager;