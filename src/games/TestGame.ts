  
import { User, DMChannel, TextChannel, NewsChannel, Message, ReactionCollector, MessageEmbed, MessageReaction } from "discord.js";
import { TestGameEmbed } from "../imports/embeds/Embeds";

export class TestGame {
    private player: User;
    private channel: DMChannel | TextChannel | NewsChannel;
    private message: Message | undefined;
    private reaction_collector: ReactionCollector | undefined;
    private grid: number[][];
    private position: number[];
    private width: number;
    private height: number;
    private moves: number = 0;
    private valid_reactions: string[] = [
        '⬅️', '⬆️', '⬇️', '➡️'
    ];
    private game_max_time = 1000 * 60 * 1; // works for 1 minute

    constructor(user: User, channel: DMChannel | TextChannel | NewsChannel, width: number, height: number) {
        this.player = user;
        this.channel = channel;

        this.width = width;
        this.height = height;
        this.position = [1, 0];

        // this.grid = new Array(this.height).fill(0).map(() => new Array(this.width).fill(0));
        this.grid = [
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
            [ 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1 ],
            [ 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1 ],
            [ 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1 ],
            [ 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1 ],
            [ 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1 ],
            [ 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1 ],
            [ 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1 ],
            [ 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1 ],
            [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]
        ];

        this.grid[this.position[0]][this.position[1]] = 3;
        this.channel.send(this.createGameEmbed()).then(this.onFirstSend.bind(this));
    }

    private createGameEmbed(): MessageEmbed {
        return TestGameEmbed(this.getEmojiGrid());
    }

    private getEmojiGrid(): string {
        return this.grid.map((row: number[]) => row.map((el: number) => {
            switch (el) {
                case 0: return "⬜";
                case 1: return "⬛";
                case 2: return "🔹";
                case 3: return "😶";
                case 4: return "⬜";
                default: return "E"
            }
        }).join("")).join("\n");
    }

    private onFirstSend(send_message: Message) {
        this.valid_reactions.forEach((valid_reaction: string) => send_message.react(valid_reaction));
        this.message = send_message;
        this.reaction_collector = send_message.createReactionCollector(
            this.collectorFilter.bind(this), 
            // { time: this.game_max_time }
        );
        this.reaction_collector.on("collect", this.onCollect.bind(this));
        this.reaction_collector.on("end", () => {
            this.message?.reactions.removeAll();
        });
    } 

    private collectorFilter(reaction: MessageReaction, user: User) {
        return !user.bot 
            && user.id === this.player.id
            && this.valid_reactions.includes(reaction.emoji.name);
    }

    private updateEmbed(won: boolean) {
        const old_embed: MessageEmbed | undefined = this.message?.embeds[0];

        if(old_embed) {
            const new_embed: MessageEmbed = old_embed
                .setDescription(this.getEmojiGrid());

            if(won) new_embed.setTitle(`Won! ${this.moves} moves!`)

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
            default: return;
        }
    }

    private move(x: number, y: number) {
        const old_position: number[] = [...this.position];
        const new_position: number[] = [
            old_position[0] + x,
            old_position[1] + y
        ];

        if(new_position[0] < 0 || new_position[1] < 0) return console.log("Outside 0");
        if(new_position[0] > this.width - 1 || new_position[1] > this.height - 1) return console.log("Outside n");
        if(this.grid[new_position[0]][new_position[1]] === 1) return console.log("Wall");

        this.moves++;
        const won: boolean = this.grid[new_position[0]][new_position[1]] === 4;

        this.grid[old_position[0]][old_position[1]] = 2;
        this.grid[new_position[0]][new_position[1]] = 3;
        this.position = new_position;

        if(won) this.end(true);
        else this.updateEmbed(false);
    }

    public end(won: boolean) {
        this.updateEmbed(won);
        return this.reaction_collector?.stop();
    }
}