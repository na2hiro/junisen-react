import Player from "./Player";
import Log from "./Log";

export default class Game {
    constructor(public players:Player[], public result = false) {
    }

    getLog(player:Player):Log {
        var enemy = this.players[0] == player ? this.players[1] : this.players[0];
        if (this.result) {
            return {enemy: enemy, win: this.players[0] == player};
        } else if (this.temp != null) {
            return {enemy: enemy, win: this.temp == player, temp: true};
        } else {
            return {enemy: enemy};
        }
    }

    temp:Player;

    tempWin(player:Player) {
        this.temp = player;
    }

    tempWinBack() {
        this.temp = null;
    }

    sameMatch(game: Game) {
        const [this1, this2] = this.players.map(player => player.order).sort();
        const [that1, that2] = game.players.map(player => player.order).sort();
        return this1 == that1 && this2 == that2;
    }

    static tempDone(players: Player[]): Game{
        const game = new Game(players, false);
        game.tempWin(players[0]);
        return game;
    }

    static done(players: Player[]): Game{
        if (players.length == 1) {
            return new NullGame(players);
        } else {
            return new Game(players, true);
        }
    }

    static undone(players: Player[]): Game {
        return new Game(players, false);
    }
}
export class NullGame extends Game {
    getLog(player:Player):Log {
        return {enemy: null};
    }
}
