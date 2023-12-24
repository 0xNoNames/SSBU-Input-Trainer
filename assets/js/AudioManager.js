export class AudioManager {
    constructor() {
        this.audioPlayer = new Audio();
        this.audioPlayer.volume = 0.05;
    }

    selectSound = (soundPath) => {
        this.audioPlayer.src = soundPath;
    };

    playSound = () => {
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.play();
    };
}