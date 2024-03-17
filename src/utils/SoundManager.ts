import { LogLevel, WriteLog } from './logger'
import { gameStore } from '@/gameStore';

class SoundManager{
    private static instance: SoundManager | null
    private audiosPlaying: HTMLAudioElement[];

    constructor(){
        this.audiosPlaying = [];
    }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }
    
    public async playSound(audio: HTMLAudioElement): Promise<void>{
        if(audio === null || audio === undefined){
            WriteLog(`SoundManager.ts > playSound > Sound was null or undefined`, LogLevel.ERROR);
        }
        else{
            return new Promise<void>((resolve) => {
                audio.play();
                this.audiosPlaying.push(audio);

                // If game is muted, volume to 0 -> allows users to mute / unmute mid sound play
                if(gameStore.getters.isMuted){
                    audio.volume = 0;
                }
                audio.onended = () =>{
                    this.audiosPlaying = this.audiosPlaying.filter(audioPlaying => audioPlaying !== audio);
                    resolve();
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
}

export default SoundManager;