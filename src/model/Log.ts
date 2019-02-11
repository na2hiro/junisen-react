import Player from "./Player";

export default interface Log {
    enemy: Player;
    win?: boolean;
    temp?: boolean;
}
