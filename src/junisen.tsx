import React, {FunctionComponent, useMemo, useState} from "react";
import ReactDOM from "react-dom";
import League from "./components/League";
import Player from "./model/Player";
import PlayerTable from "./model/PlayerTable";
import LeagueSetting from "./model/LeagueSetting";
import Game, {NullGame} from "./model/Game";
import SettingContext from "./utils/SettingContext";

type Props = {
    players: Player[];
    setting: LeagueSetting;
    doneGames: Game[];
    undoneGames: Game[];
}

const Junisen: FunctionComponent<Props> = ({players, setting, doneGames, undoneGames}) => {
    const playerTable = useMemo(()=>new PlayerTable(players), []);
    return (
        <SettingContext.Provider value={setting}>
            <League playerTable={playerTable} doneGames={doneGames} undoneGames={undoneGames} />
            <h2>ソースコード</h2>
            <p><a href="https://github.com/na2hiro/junisen-react">na2hiro/junisen-react</a></p>
            <p>React Hooksを使って書きました</p>
        </SettingContext.Provider>
    );
};

function initialize(names: string[], doneGames, undoneGames, setting) {
    var players = names.map(function (n) {
        return new Player(n)
    });
    var playerTable = new PlayerTable(players);
    doneGames = toP(doneGames)
        .map(Game.done);
    undoneGames = toP(undoneGames)
        .filter(arr=>arr.length == 2)
        .map(Game.undone);

    function toP(indices) {
        return indices.map(function (g) {
            return g.map(function (pn) {
                return players[pn]
            })
        });
    }
/*
    gameTable = new GameTable(playerTable, setting);
    doneGames.map((arr)=> {
        if (arr.length == 1) {
            return new NullGame(arr);
        } else {
            return new Game(arr, true);
        }
    }).forEach((game)=>gameTable.add(game));
    undoneGames.filter(arr=>arr.length == 2).map((arr)=>new Game(arr, false)).forEach((game)=>gameTable.add(game));
    gameTable.printSearched();
*/

    ReactDOM.render(
        <Junisen players={players} setting={setting} doneGames={doneGames} undoneGames={undoneGames} />,
        document.getElementById("junisen")
    );
}

const data = window["data"];
const setting = window["setting"];
initialize(data.players, data.doneGames, data.undoneGames, setting);

