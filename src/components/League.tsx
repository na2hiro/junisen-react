import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer
} from "react";
import queryString from "query-string";

import Game from "../model/Game";
import LeagueModel from "../model/League";
import PlayerTableModel from "../model/PlayerTable";
import DoneGameDispatchContext from "../utils/DoneGameDispatchContext";
import SettingContext from "../utils/SettingContext";
import CombinationTable from "./CombinationTable";
import PlayerTable from "./PlayerTable";
import DoneSelectButton from "./DoneSelectButton";
import { UndoneLog } from "../model/Log";

interface Props {
    playerTable: PlayerTableModel;
    doneGames: Game[];
    undoneGames: Game[];
    initialDoneGames: Game[];
}
const League: FunctionComponent<Props> = React.memo(
    ({ playerTable, doneGames, undoneGames, initialDoneGames }) => {
        const setting = useContext(SettingContext);
        const [selectedDoneGames, dispatchDoneGames] = useReducer(
            (selectedDoneGames: Game[], action: { action: string; game?: number[] }) => {
                const newImaginaryGame = Game.done(
                    (action.game || []).map(player => playerTable.players[player])
                );
                switch (action.action) {
                    case "select":
                        return selectedDoneGames
                            .filter(game => !game.sameMatch(newImaginaryGame))
                            .concat([newImaginaryGame]);
                    case "unselect":
                        return selectedDoneGames.filter(game => !game.sameMatch(newImaginaryGame));
                    case "clear":
                        return [];
                    default:
                        throw new Error("unknown action");
                }
            },
            initialDoneGames
        );
        useEffect(() => {
            const newHash = queryString.stringify({
                done: JSON.stringify(selectedDoneGames.map(g => g.serialize()))
            });
            try {
                history.replaceState("", document.title, window.location.pathname + "#" + newHash);
            } catch (e) {
                location.hash = newHash;
            }
        });
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
        const onClickClear = useCallback(() => {
            dispatchDoneGames({ action: "clear" });
        }, []);

        return (
            <DoneGameDispatchContext.Provider value={dispatchDoneGames}>
                <h2>
                    残りの対局<button onClick={onClickClear}>クリア</button>
                </h2>
                <UndoneGames undoneGames={undoneGames} />
                <h2>現在の順位表</h2>
                {LeagueModel.settingToString(setting)}{" "}
                <button onClick={onClickClear}>クリア</button>
                <PlayerTable model={playerTable} games={model.map} combination={model.searched} />
                <h2>順位表数え上げ</h2>
                <p>マスの中：勝-敗 星 順位</p>
                <CombinationTable combination={model.searched} players={playerTable.players} />
            </DoneGameDispatchContext.Provider>
        );
    }
);

export default League;

type UndoneGamesProps = {
    undoneGames: Game[];
};
const UndoneGames: FunctionComponent<UndoneGamesProps> = ({ undoneGames }) => {
    return (
        <ul>
            {undoneGames.map(game => (
                <li>
                    {`${game.players[0].name} (${game.players[0].order + 1}) `}
                    <DoneSelectButton
                        player={game.players[0]}
                        log={game.getLog(game.players[0]) as UndoneLog}
                    />
                    {" - "}
                    <DoneSelectButton
                        player={game.players[1]}
                        log={game.getLog(game.players[1]) as UndoneLog}
                    />
                    {` ${game.players[1].name} (${game.players[1].order + 1})`}
                </li>
            ))}
        </ul>
    );
};
