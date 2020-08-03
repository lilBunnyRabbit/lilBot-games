import { ClientEvents } from "discord.js";

export class EventHandler {
    readonly type: keyof ClientEvents;
    readonly execute: Function = () => {};
    
    public constructor(type: keyof ClientEvents, execute: Function) {
        this.type = type;
        this.execute = execute;
    }
}