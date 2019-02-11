import LeagueModel from "../model/League";
import React, {FunctionComponent, useContext, useMemo, useReducer, useState} from "react";
import PlayerTableModel from "../model/PlayerTable";
import LeagueSetting from "../model/LeagueSetting";
import Game from "../model/Game";
import PlayerTable from "./PlayerTable";
import SettingContext from "../utils/SettingContext";
import CombinationTable from "./CombinationTable";
import DoneGameDispatchContext from "../utils/DoneGameDispatchContext";

type Props = {
    playerTable: PlayerTableModel;
    doneGames: Game[];
    undoneGames: Game[];
}
const League: FunctionComponent<Props> = React.memo(({playerTable, doneGames, undoneGames}) => {
    const setting = useContext(SettingContext);
    const [selectedDoneGames, dispatchDoneGames] = useReducer((selectedDoneGames, action)=>{
        const newImaginaryGame = Game.done(action.game.map(player => playerTable.players[player]));
        switch(action.action) {
            case "select":
                return selectedDoneGames
                    .filter(game => !game.sameMatch(newImaginaryGame))
                    .concat([newImaginaryGame]);
            case "unselect":
                return selectedDoneGames
                    .filter(game => !game.sameMatch(newImaginaryGame));
            default:
                throw "unknown action";
        }

    }, []);
    const modelInstance = useMemo(()=> {
        const model = new LeagueModel(playerTable, setting);
        doneGames
            .forEach(game =>model.add(game));
        undoneGames
            .forEach(game => model.add(game));

        return model;
    }, []);
    const model = useMemo(() => {
        const model = modelInstance;
        model.setImaginary(selectedDoneGames);
        model.search();
        console.log("search");
        return model;
    }, [selectedDoneGames]);

    return (
        <DoneGameDispatchContext.Provider value={dispatchDoneGames}>
            <h2>現在の順位表</h2>
            {LeagueModel.settingToString(setting)}
            <PlayerTable model={playerTable} games={model.map} />
            ※？ボタンをクリックすると，そこが勝利である場合のみを下のテーブルで表示します．
            <h2>順位表数え上げ</h2>
            <p>マスの中：勝-敗 星 順位</p>
            <CombinationTable combination={model.searched} players={playerTable.players} />
        </DoneGameDispatchContext.Provider>
    )
});

export default League
