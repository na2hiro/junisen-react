import Player from "./Player";

export default class PlayerTable {
    constructor(public players:Player[]) {
        players.map(function (player) {
            for (var l = 2; l <= player.name.length; l++) {
                var abbrev = player.name.slice(0, l);
                if (players.every(function (p) {
                    return player.name == p.name || p.name.indexOf(abbrev) != 0
                })) {
                    player.abbrev = abbrev;
                    return;
                }
            }
        });
    }

    writeOrder() {
        this.players.forEach((player, num)=> {
            player.order = num;
        });
    }
}

