interface NarrationNode{
    text: string;
    goTo: number;
    options?: {text: string, goTo: number}[];
}

export default NarrationNode;