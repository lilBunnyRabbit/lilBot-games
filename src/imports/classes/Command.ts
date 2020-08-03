import { Message } from "discord.js";

export class Command {
    readonly name: string;
    readonly description: string;
    readonly channels: Array<string> | undefined;
    private command: Function = () => {};
    
    public constructor(name: string, description: string, channels?: Array<string>) {
        this.name = name.toUpperCase();
        this.description = description;
        this.channels = channels;
    }

    public setCommand(command: Function): Command {
        if(!command) return this;
        this.command = command;
        return this;
    }

    public execute(msg: Message, args: Array<string>) {
        console.log(`Executing ${this.name}`);
        
        if(!this.canExecute(msg, args)) return;     
        return this.command(msg, args);
    }

    private canExecute(msg: Message, args: Array<string>): boolean {
        if(this.channels && !this.channels.includes(msg.channel.id)) return false;
        return true;
    }
}