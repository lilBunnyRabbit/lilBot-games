import Discord from 'discord.js';
import fs from 'fs';
import { Command } from '../imports/classes/Command';
import { EventHandler } from '../imports/classes/EventHandler';

export default async (prefix: string): Promise<Discord.Client> => {
    const client: any = new Discord.Client();
    client.prefix = prefix;
    addEvents(client);
    await addCommands(client);
    await client.login(process.env.BOT_TOKEN)
    return client;
}

function addEvents(client: any) {
    const event_files: Array<string> = fs.readdirSync("./src/bot/events").filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    for(const event_file of event_files) {
        try { 
            const event: EventHandler = require(`./events/${event_file}`).default;
            client.on(event.type, event.execute);
        } catch (error) {
            throw new Error(`Failed to add event listener ${event_file}\n${error}`); 
        }
    }
}

async function addCommands(client: any) {
    client.commands = new Discord.Collection();
    const command_files: Array<string> = fs.readdirSync("./src/bot/commands").filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    for(const command_file of command_files) {
        try { 
            const command: Command = require(`./commands/${command_file}`).default;
            await client.commands.set(command.name, command);
        } catch (error) {
            throw new Error(`Failed to add ${command_file} to Discord commands collection\n${error}`); 
        }
    }
}