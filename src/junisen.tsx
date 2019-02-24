import React, { FunctionComponent, useMemo } from "react";
import ReactDOM from "react-dom";
import queryString from "query-string";

import League from "./components/League";
import Player from "./model/Player";
import PlayerTable from "./model/PlayerTable";
import LeagueSetting from "./model/LeagueSetting";
import Game from "./model/Game";
import SettingContext from "./utils/SettingContext";

type Props = {
    players: Player[];
    setting: LeagueSetting;
    doneGames: Game[];
    undoneGames: Game[];
    initialDoneGames: Game[];
}

const Junisen: FunctionComponent<Props> = ({ players, setting, doneGames, undoneGames, initialDoneGames }) => {
    const playerTable = useMemo(() => new PlayerTable(players), []);
    return (
        <SettingContext.Provider value={setting}>
            <League playerTable={playerTable} doneGames={doneGames} undoneGames={undoneGames}
                    initialDoneGames={initialDoneGames}/>
            <h2>ソースコード</h2>
            <p><a href="https://github.com/na2hiro/junisen-react">na2hiro/junisen-react</a></p>
            <p>React Hooksを使って書きました</p>
        </SettingContext.Provider>
    );
};

function initialize(names: string[], doneGames: number[][], undoneGames: number[][], setting: LeagueSetting) {
    var players = names.map(function(n) {
        return new Player(n);
    });
    const done = toP(doneGames)
        .map(Game.done);
    const undone = toP(undoneGames)
        .filter(arr => arr.length == 2)
        .map(Game.undone);

    let initialDoneGames: Game[] = [];
    try {
        const hash = queryString.parse(location.hash);
        if (typeof hash.done === "string") {
            initialDoneGames = toP(JSON.parse(hash.done))
                .map(Game.done)
                .filter(game => undone.some(undoneGame => undoneGame.sameMatch(game)));
        }
    } catch (e) {
        // ignore
        location.hash = "";
    }

    function toP(indices: number[][]) {
        return indices.map(function(g) {
            return g.map(function(pn) {
                return players[pn];
            });
        });
    }

    ReactDOM.render(
        <Junisen players={players} setting={setting} doneGames={done} undoneGames={undone}
                 initialDoneGames={initialDoneGames}/>,
        document.getElementById("junisen")
    );
}

const data = (window as any)["data"];
const setting = (window as any)["setting"];
initialize(data.players, data.doneGames, data.undoneGames, setting);

