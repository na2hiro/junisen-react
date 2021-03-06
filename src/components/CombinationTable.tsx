import React, { FunctionComponent } from "react";
import LeagueModel, { PlayerResult } from "../model/League";
import Player from "../model/Player";

interface Props {
    combination: Array<{ players: PlayerResult[]; games: any[] }>;
    players: Player[];
}
const CombinationTable: FunctionComponent<Props> = ({ combination, players }) => (
    <table>
        <thead>
            <tr>
                {players.map((player, i) => (
                    <th key={i}>{player.abbrev}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {combination.map(possibility => (
                <CombinationTableRow possibility={possibility} key={hashPossibility(possibility)} />
            ))}
        </tbody>
    </table>
);

export default CombinationTable;

type RowProps = {
    possibility: { players: PlayerResult[] };
};

const hashPossibility = ({ players }: { players: PlayerResult[] }) => {
    return players
        .map(player =>
            player.result
                .map(win => (win === null ? null : LeagueModel.getWinMark(win)))
                .filter(n => n)
                .join("")
        )
        .join(",");
};

const CombinationTableRow: FunctionComponent<RowProps> = ({ possibility }) => (
    <tr>
        {possibility.players.map((player, i) => {
            let className;
            if (player.challenge) {
                className = "challenge";
            } else if (player.playoff) {
                className = "playoff";
            } else if (player.down) {
                className = "down";
            }
            return (
                <td key={i} className={className}>
                    {`${player.win}-${player.lose}${player.result
                        .map(win => (win === null ? null : LeagueModel.getWinMark(win)))
                        .filter(n => n)
                        .join("")}(${player.rank + 1})`}
                </td>
            );
        })}
    </tr>
);
