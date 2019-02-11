import React, {FunctionComponent} from "react";
import LeagueModel from "../model/League";
import Player from "../model/Player";

type Props = {
    combination: {players: any[], games: any[]}[];
    players: Player[];
}
const CombinationTable: FunctionComponent<Props> = ({combination, players}) => {
    return (
        <table>
            <thead>
            <tr>
                {players.map((player)=> <th>{player.abbrev}</th>)}
            </tr>
            </thead>
            <tbody>
            {combination.map(possibility => {
                return (<tr>
                    {possibility.players.map((player, i) => {
                        let className;
                        if (player.challenge) className = "challenge";
                        else if (player.playoff) className = "playoff";
                        else if (player.down) className = "down";
                        return (
                            <td key={i} className={className}>
                                {`${player.win}-${player.lose}${player.result.map((win) => win === null ? null : LeagueModel.getWinMark(win)).filter(n => n).join("")}(${player.rank + 1})`}
                            </td>
                        )
                    })}
                </tr>);
            })}
            </tbody>
        </table>
    )
};

export default CombinationTable;
