import { Player } from '../classes/Player';
import { PlayerJson } from '../types/PlayerTypes';
import { type } from 'os';

export type MatchTypes = "1v1" | "2v2" | "3v3" | "4v4";

export type CredentialsType = {
    username: string,
    password: string
}

export type MatchPlayer = {
    player: Player,
    team: number,
    isCaptain: boolean
}

export type MatchPlayerJson = {
    player: PlayerJson,
    team: number,
    isCaptain: boolean
}

export type QueuePlayer = {
    _id: string,
    is_substitute: boolean
}

export type MatchJson = {
    _id?: any,
    host: string;
    team_player_limit: number;
    credentials: CredentialsType;
    status: string;
    time_created: number;
    start_time: number;
    end_time: number;
    is_queue_open: boolean;
    queue: Array<any>;
    teams: Array<any>;
    lobby_channel_id: string;
    team_channel_ids: Array<any>;
    votes: Array<any>;
}

export type MatchInProgressJson = {
    id: string,
    match_type: string,
    host: PlayerJson,
    credentials: CredentialsType,
    players: Array<MatchPlayerJson>,
    start_time: number,
    end_time: number,
    lobby_channel_id: string,
    team_channel_ids: {
        team1: string,
        team2: string
    },
    votes: Array<MatchVote>
}

export type MatchVote = {
    discord_id: string,
    vote: "won" | "lost"
}