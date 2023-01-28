import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { ICryptomusService } from "../cryptomus/cryptomus.interface";
import { IDataBase } from "../database/database.interface";
import { Command } from "./command.class";

export class StartCommand extends Command {
  constructor(
    bot: Telegraf<IBotContext>,
    private readonly cryptomusService: ICryptomusService,
    private readonly dataBaseService: IDataBase
  ) {
    super(bot)
  }

  handle(): void {
    this.bot.start(async (ctx) => {
      const res = await this.cryptomusService.createPayment(1, '10')
      if (!res) {
        ctx.reply('Ошибка');
        return
      }
      console.log(res);
      await this.dataBaseService.payment.create({
        data: {
          uuid: res.result.uuid,
          orderId: res.result.order_id,
          status: res.result.status,
          amount: res.result.amount,
          paymentAmount: res.result.payment_amount,
          isFinal: res.result.is_final,
          url: res.result.url,
          chatId: ctx.from.id,
        }
      })
      ctx.reply(res.result.url)
    })
  }
}