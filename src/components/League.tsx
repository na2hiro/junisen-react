import React, { FunctionComponent, useContext, useMemo, useReducer } from "react";
import Game from "../model/Game";
import LeagueModel from "../model/League";
import PlayerTableModel from "../model/PlayerTable";
import DoneGameDispatchContext from "../utils/DoneGameDispatchContext";
import SettingContext from "../utils/SettingContext";
import CombinationTable from "./CombinationTable";
import PlayerTable from "./PlayerTable";

interface Props {
    playerTable: PlayerTableModel;
    doneGames: Game[];
    undoneGames: Game[];
}
const League: FunctionComponent<Props> = React.memo(({ playerTable, doneGames, undoneGames }) => {
    const setting = useContext(SettingContext);
    const [selectedDoneGames, dispatchDoneGames] = useReducer(
        (selectedDoneGames: Game[], action: { action: string; game: number[] }) => {
            const newImaginaryGame = Game.done(
                action.game.map(player => playerTable.players[player])
            );
            switch (action.action) {
                case "select":
                    return selectedDoneGames
                        .filter(game => !game.sameMatch(newImaginaryGame))
                        .concat([newImaginaryGame]);
                case "unselect":
                    return selectedDoneGames.filter(game => !game.sameMatch(newImaginaryGame));
                default:
                    throw new Error("unknown action");
            }
        },
        []
    );
    const modelInstance = useMemo(() => {
        const model = new LeagueModel(playerTable, setting);
        doneGames.forEach(game => model.add(game));
        undoneGames.forEach(game => model.add(game));

        return model;
    }, []);
    const model = useMemo(() => {
        const model = modelInstance;
        model.setImaginary(selectedDoneGames);
        model.search();
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
    );
});

export default League;
