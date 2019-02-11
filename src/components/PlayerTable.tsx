import React, { FunctionComponent, useCallback, useContext, useMemo } from "react";
import Game from "../model/Game";
import League from "../model/League";
import Player from "../model/Player";
import PlayerTableModel from "../model/PlayerTable";
import DoneGameDispatchContext from "../utils/DoneGameDispatchContext";
import SettingContext from "../utils/SettingContext";

interface Props {
    model: PlayerTableModel;
    games: { [name: string]: Game[] };
}

const PlayerTable: FunctionComponent<Props> = ({ model, games }) => {
    const kaisenThs = useMemo(
        () => games[model.players[0].name].map((_, i) => <th key={i}>{i + 1}回戦</th>),
        []
    );
    return (
        <table>
            <thead>
                <tr>
                    <th>棋士</th>
                    <th>勝敗</th>
                    <th>順</th>
                    <th>確</th>
                    {useContext(SettingContext).playoff ? (
                        <>
                            <th>挑</th>
                            <th>プ</th>
                        </>
                    ) : (
                        <th>昇</th>
                    )}
                    <th>降</th>
                    {kaisenThs}
                </tr>
            </thead>
            <tbody>
                {model.players.map((player, i) => (
                    <PlayerTableRow player={player} games={games[player.name]} key={i} />
                ))}
            </tbody>
        </table>
    );
};
export default PlayerTable;

interface RowProps {
    player: Player;
    games: Game[];
}

const PlayerTableRow: FunctionComponent<RowProps> = ({ player, games }) => {
    const setting = useContext(SettingContext);
    let mark = "";
    let className;
    if (player.countChallenge == player.numCombinations) {
        className = "challenge";
        mark = setting.playoff ? "挑" : "昇";
    } else if (player.countPlayoff == player.numCombinations) {
        className = "playoff";
        mark = "プ";
    } else if (player.countDown == player.numCombinations) {
        className = "down";
        mark = "降";
    }
    return (
        <tr className={className}>
            <td>{player.name}</td>
            <td>{`${player.win}-${player.lose}`}</td>
            <td>{(player.rank + 1).toString()}</td>
            <td>{mark}</td>
            <td className="count">{player.countChallenge.toString()}</td>
            {setting.playoff && <td className="count">{player.countPlayoff.toString()}</td>}
            <td className="count">{player.countDown.toString()}</td>
            {games.map((game, i) => (
                <PlayerTableCell game={game} player={player} key={i} />
            ))}
        </tr>
    );
};

interface CellProps {
    game: Game;
    player: Player;
}

const PlayerTableCell: FunctionComponent<CellProps> = ({ game, player }) => {
    const doneGameDispatch = useContext(DoneGameDispatchContext);
    const log = game.getLog(player);
    if (!log.enemy) {
        return <td />;
    } else if (typeof log.win === "undefined" || log.temp) {
        let mark,
            action = "select";
        if (typeof log.win === "undefined") {
            mark = "?";
        } else if (log.win) {
            mark = "○";
            action = "unselect";
        } else {
            mark = "●";
        }
        const dispatch = useCallback(
            () =>
                doneGameDispatch({
                    action,
                    game: [player.order, log.enemy.order]
                }),
            [player, log]
        );
        return (
            <td>
                <button onClick={dispatch}>{mark}</button>
                <span className="name">{log.enemy.abbrev}</span>
            </td>
        );
    } else {
        return (
            <td>
                {typeof log.win === "undefined" ? "　" : League.getWinMark(log.win)}
                <span className="name">{log.enemy.abbrev}</span>
            </td>
        );
    }
};
