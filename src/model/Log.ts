import Player from "./Player";

export default interface Log {
    enemy: Player;
    win?: Boolean;
    temp?: Boolean;
}
