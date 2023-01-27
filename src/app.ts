import { Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.command";
import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { IBotContext } from "./context/context.interface";
import { DatabaseService } from "./database/database.service";

class Bot {
  bot: Telegraf<IBotContext>
  commands: Command[] = []
  constructor(private readonly configService: IConfigService, private readonly databaseService: DatabaseService) {
    this.bot = new Telegraf<IBotContext>(this.configService.get('TOKEN'))
    this.bot.use(
      new LocalSession({ database: 'sessions.json' }).middleware()
    )
  }
  async init() {
    await this.databaseService.init();
    this.commands = [new StartCommand(this.bot)]
    for (const command of this.commands) {
      command.handle()
    }
    this.bot.launch()
  }
}

const database = new DatabaseService();

const bot = new Bot(new ConfigService(), database);
bot.init()