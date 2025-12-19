import { Telegraf, Markup } from "telegraf";
import { config } from "dotenv";

config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// URL siz — kurslar qo'lda yozilgan (hardcode)
const rates = {
  usd: 12060,  // 1 USD = 12060 UZS
  eur: 14129,  // 1 EUR = 14129 UZS
  rub: 150.07  // 1 RUB = 150.07 UZS
};

// Asosiy menu
const mainMenu = Markup.keyboard([
  ["💵 USD kurs", "💶 EUR kurs"],
  ["🇷🇺 RUB kurs"],
  ["🔄 Konvertatsiya qilish"]
]).resize();

// /start
bot.start((ctx) => {
  ctx.reply(
    "Assalomu alaykum! 💰\nValyuta kursi botiga xush kelibsiz!\n\nQuyidagi tugmalardan birini tanlang:",
    mainMenu
  );
});

bot.hears("💵 USD kurs", (ctx) => {
  ctx.reply(`💵 1 USD = ${rates.usd.toLocaleString("ru-RU")} UZS`, mainMenu);
});

bot.hears("💶 EUR kurs", (ctx) => {
  ctx.reply(`💶 1 EUR = ${rates.eur.toLocaleString("ru-RU")} UZS`, mainMenu);
});

bot.hears("🇷🇺 RUB kurs", (ctx) => {
  ctx.reply(`🇷🇺 1 RUB = ${rates.rub.toFixed(2)} UZS`, mainMenu);
});

bot.hears("🔄 Konvertatsiya qilish", (ctx) => {
  ctx.reply(
    "💱 Miqdor va valyutani yozing:\n\nMisollar:\n• 100 usd\n• 50 euro\n• 1000 rubl",
    Markup.keyboard([["🔙 Orqaga"]]).resize()
  );
});

bot.hears("🔙 Orqaga", (ctx) => {
  ctx.reply("Bosh menyuga qaytdik!", mainMenu);
});

bot.on("text", (ctx) => {
  const text = ctx.message.text.toLowerCase().trim();

  if (["💵 usd kurs", "💶 eur kurs", "🇷🇺 rub kurs", "🔄 konvertatsiya qilish", "🔙 orqaga"].includes(text)) {
    return;
  }

  const match = text.match(/(\d+(?:\.\d+)?)\s*(usd|dollar|euro|eur|rubl|rub)/);
  if (!match) {
    return ctx.reply("❌ To'g'ri formatda yozing:\nMisol: 100 usd yoki 50 euro", mainMenu);
  }

  const amount = parseFloat(match[1]);
  const cur = match[2];

  let result;
  if (["usd", "dollar"].includes(cur)) {
    result = Math.round(amount * rates.usd);
    ctx.reply(`💰 ${amount} USD = ${result.toLocaleString("ru-RU")} UZS`, mainMenu);
  } else if (["euro", "eur"].includes(cur)) {
    result = Math.round(amount * rates.eur);
    ctx.reply(`💰 ${amount} EUR = ${result.toLocaleString("ru-RU")} UZS`, mainMenu);
  } else if (["rubl", "rub"].includes(cur)) {
    result = Math.round(amount * rates.rub);
    ctx.reply(`💰 ${amount} RUB = ${result.toLocaleString("ru-RU")} UZS`, mainMenu);
  }
});

bot.launch();
console.log("💰 Valyuta boti ishga tushdi! (URL siz versiya)");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
