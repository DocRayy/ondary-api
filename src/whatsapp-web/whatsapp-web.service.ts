import { Injectable, OnModuleInit } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import qrcode from "qrcode-terminal";
import { Client, MessageMedia } from "whatsapp-web.js";

@Injectable()
export class WhatsappWebService implements OnModuleInit {
  private client: Client;

  constructor(private schedulerRegistry: SchedulerRegistry) {
    this.client = new Client({
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    this.client.on("qr", (qr) => {
      if (process.env.IS_WHATSAPP_LOGGED_IN !== "true") {
        process.env.WHATSAPP_QR_CODE = qr;
        process.env.IS_WHATSAPP_LOGGED_IN = "false";
      }
      qrcode.generate(qr, { small: true });
    });

    this.client.on("ready", () => {
      process.env.IS_WHATSAPP_LOGGED_IN = "true";
      console.log("WhatsApp Client is ready!");
      // this.startCronJob();
    });

    this.client.on("message", (message) => {
      console.log(`${message.from}: ${message.body}`);

      // if (message.body === "testing") {
      //   message.reply("auto reply?", message.from);
      // }
    });
  }

  async onModuleInit() {
    await this.client.initialize();
  }

  getClient() {
    return this.client;
  }

  private async sendScheduledMessage() {
    console.log("Sending scheduled message...");
    // pak wilson phone number
    const number = "+62811705988";
    const text = "test";
    const media = await MessageMedia.fromUrl(
      "https://www.shutterstock.com/image-photo/natural-hills-picture-growing-shining-600nw-1735499282.jpg",
    );

    const chatId = number.substring(1) + "@c.us";

    await this.client.sendMessage(chatId, text);
    await this.client.sendMessage(chatId, media);
  }

  private startCronJob() {
    const job = new CronJob(CronExpression.EVERY_10_MINUTES, () => {
      this.sendScheduledMessage();
    });

    this.schedulerRegistry.addCronJob("whatsapp-message-job", job);
    job.start();
  }
}
