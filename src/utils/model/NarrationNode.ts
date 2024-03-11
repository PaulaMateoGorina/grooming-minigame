interface NarrationNode{
    text: string;
    goTo: number;
    audioFile: string;
    options?: {text: string, goTo: number}[];
    audio?: HTMLAudioElement;
}

export default NarrationNode;