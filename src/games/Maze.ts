  
import { User, DMChannel, TextChannel, NewsChannel, Message, ReactionCollector, MessageEmbed, MessageReaction, GuildMember } from "discord.js";
import { MazeEmbed } from "../imports/embeds/Embeds";
import { generateMaze } from "../game_gen/Maze_gen";

export class Maze {
    private player: GuildMember;
    private channel: DMChannel | TextChannel | NewsChannel;
    private message: Message | undefined;
    private reaction_collector: ReactionCollector | undefined;
    private grid: number[][] = [];
    private position: number[] = [];
    private width: number;
    private height: number;
    private moves: number = 0;
    private game_max_time: number = 1000 * 60 * 5; // 5 minutes
    private valid_reactions: string[] = [
        '⬅️', '⬆️', '⬇️', '➡️', '🔁'
    ];

    constructor(user: GuildMember, channel: DMChannel | TextChannel | NewsChannel, width: number, height: number) {
        this.player = user;
        this.channel = channel;
        this.width = width;
        this.height = height;
        this.newMaze();
        this.channel.send(this.createGameEmbed()).then(this.onFirstSend.bind(this));
    }

    private newMaze() {
        this.position = [1, 0];
        this.grid = generateMaze(this.width, this.height); // max 8 x 5
        this.grid[this.position[0]][this.position[1]] = 3;
    }

    private createGameEmbed(): MessageEmbed {
        return MazeEmbed(
            `${this.player.displayName}'s Maze (${this.game_max_time / 1000 / 60} minutes)`,
            this.getEmojiGrid()
        );
    }

    private getEmojiGrid(): string {
        return this.grid.map((row: number[]) => row.map(this.getElement).join("")).join("\n");
    }

    private getElement(id: number): string {
        switch (id) {
            case 0: return "⬛";
            case 1: return "⬜";
            case 2: return "🔹";
            case 3: return "🐰";
            case 4: return "🥕";
            default: return "❌"
        }
    }

    private onFirstSend(send_message: Message) {
        this.valid_reactions.forEach((valid_reaction: string) => send_message.react(valid_reaction));
        this.message = send_message;
        this.reaction_collector = send_message.createReactionCollector(
            this.collectorFilter.bind(this), 
            { time: this.game_max_time }
        );
        this.reaction_collector.on("collect", this.onCollect.bind(this));
        this.reaction_collector.on("end", () => this.end(false, false));
    } 

    private collectorFilter(reaction: MessageReaction, user: User) {
        return !user.bot 
            && user.id === this.player.id
            && this.valid_reactions.includes(reaction.emoji.name);
    }

    private updateEmbed(won: boolean, lost: boolean) {
        const old_embed: MessageEmbed | undefined = this.message?.embeds[0];

        if(old_embed) {
            const new_embed: MessageEmbed = old_embed
                .setDescription(this.getEmojiGrid());
                
            if(won) new_embed.setTitle(`${old_embed.title}\nWon! ${this.moves} moves!`);
            else if(lost) new_embed.setTitle(`${old_embed.title}\nLost... Time's up!`);

            this.message?.edit(new_embed);
        }
    }

    private onCollect(reaction: MessageReaction) {
        try { reaction.users.remove(this.player.id); } 
        catch (error) {}
        
        switch(reaction.emoji.name) {
            case '⬅️': return this.move(0, -1);
            case '⬆️': return this.move(-1, 0);
            case '⬇️': return this.move(1, 0);
            case '➡️': return this.move(0, 1);
            case '🔁': return this.restart();
            default: return;
        }
    }

    private move(x: number, y: number) {
        const old_position: number[] = [...this.position];
        const new_position: number[] = [
            old_position[0] + x,
            old_position[1] + y
        ];

        if(new_position[0] < 0 || new_position[1] < 0) return;
        if(this.grid[new_position[0]][new_position[1]] === 1) return;

        this.moves++;
        const won: boolean = this.grid[new_position[0]][new_position[1]] === 4;

        this.grid[old_position[0]][old_position[1]] = 2;
        this.grid[new_position[0]][new_position[1]] = 3;
        this.position = new_position;

        if(won) this.end(true, false);
        else this.updateEmbed(false, false);
    }

    private restart() {
        this.moves = 0;
        this.newMaze();
        this.updateEmbed(false, false);
    }

    public end(won: boolean, lost: boolean) {
        if(won) this.updateEmbed(true, false);
        else if(lost) this.updateEmbed(false, true);
        else this.updateEmbed(false, false);
        this.message?.reactions.removeAll();
        return this.reaction_collector?.stop();
    }
}