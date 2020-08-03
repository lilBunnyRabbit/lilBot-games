import { Client } from 'discord.js';
import { EventHandler } from '../../imports/classes/EventHandler';

export default new EventHandler("ready", function(this: Client) {
    const bot_tag: string = `${this.user?.username}#${this.user?.discriminator}`;
    const users_count: number = this.users.cache.size;
    const channels_count: number = this.channels.cache.size;
    const guilds_count: number = this.guilds.cache.size;

    console.log(`Logged in as ${bot_tag} (${users_count} users, ${channels_count} channels, ${guilds_count} guilds)`);
});