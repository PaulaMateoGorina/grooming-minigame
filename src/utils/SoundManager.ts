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
        
        if(audioIdx === null || audioIdx === undefined || isNaN(audioIdx)){
            WriteLog(`SoundManager.ts > playSound > Sound was null, undefined or non-numerical`, LogLevel.ERROR);
        }
        else{
            return new Promise<void>((resolve) => {
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
    }

    public async playSound(audio: HTMLAudioElement, loop?: boolean): Promise<void>{
        
        if(audio === null || audio === undefined){
            WriteLog(`SoundManager.ts > playSound > Sound was null or undefined`, LogLevel.ERROR);
        }
        else{
            return new Promise<void>((resolve) => {
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
    }

    public mute():void{
        for(const audio of this.audiosPlaying){
            audio.volume = 0;
        }
    }

    public unmute():void{
        for(const audio of this.audiosPlaying){
            audio.volume = 1;
        }
    }

    public stopSounds():void{
        for(const audio of this.audiosPlaying){
            audio.pause();
            audio.currentTime = 0;
        }
        this.audiosPlaying = [];
    }
}

export default SoundManager;