import Player from "./Player";

type Log =
    | {
          enemy: Player;
      } & (
          | {
                type: "done";
                win: boolean;
            }
          | {
                type: "temp";
                win: boolean;
                temp: true;
            }
          | {
                type: "undone";
            })
    | {
          type: "empty";
      };
export default Log;
