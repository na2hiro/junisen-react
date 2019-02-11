export default class Player {
    win = 0;
    lose = 0;
    order:number;
    rank:number;
    challenge:Boolean;
    playoff:Boolean;
    down:Boolean;
    countChallenge = 0;
    countPlayoff = 0;
    countDown = 0;
    abbrev:string;
    numCombinations = -1;

    constructor(public name:string) {
    }

    resetCounts() {
        this.countDown = this.countChallenge = this.countPlayoff = 0;
    }

    resetFlags() {
        this.down = this.challenge = this.playoff = false;
    }
}
