import { Telegraf, Markup } from "telegraf";
import { config } from "dotenv";

config();

const bot = new Telegraf(process.env.BOT_TOKEN);

async function getRates() {
  try {
    const res = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json");
    const data = await res.json();
    return data.usd; 
  } catch {
    return null;
  }
}

const mainMenu = Markup.keyboard([
  ["💵 USD kurs", "💶 EUR kurs"],
  ["🇷🇺 RUB kurs"],
  ["🔄 Konvertatsiya qilish"]
]).resize();

bot.start((ctx) => {
  ctx.reply(
    "Assalomu alaykum! 💰\nValyuta kursi botiga xush kelibsiz!\n\nQuyidagi tugmalardan birini tanlang:",
    mainMenu
  );
});

bot.hears("💵 USD kurs", async (ctx) => {
  const rates = await getRates();
  if (!rates) return ctx.reply("❌ Kurslarni yuklay olmadim, keyinroq urinib ko'ring.");

  const kurs = Math.round(rates.uzs);
  ctx.reply(`💵 1 USD = ${kurs.toLocaleString("ru-RU")} UZS`, mainMenu);
});

bot.hears("💶 EUR kurs", async (ctx) => {
  const rates = await getRates();
  if (!rates) return ctx.reply("❌ Kurslarni yuklay olmadim.");

  const kurs = Math.round(rates.uzs / rates.eur);
  ctx.reply(`💶 1 EUR = ${kurs.toLocaleString("ru-RU")} UZS`, mainMenu);
});

bot.hears("🇷🇺 RUB kurs", async (ctx) => {
  const rates = await getRates();
  if (!rates) return ctx.reply("❌ Kurslarni yuklay olmadim.");

  const kurs = (rates.uzs / rates.rub).toFixed(2);
  ctx.reply(`🇷🇺 1 RUB = ${kurs} UZS`, mainMenu);
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

bot.on("text", async (ctx) => {
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

  const rates = await getRates();
  if (!rates) return ctx.reply("❌ Kurslarni yuklay olmadim.");

  let result;
  if (["usd", "dollar"].includes(cur)) {
    result = Math.round(amount * rates.uzs);
    ctx.reply(`💰 ${amount} USD = ${result.toLocaleString("ru-RU")} UZS`, mainMenu);
  } else if (["euro", "eur"].includes(cur)) {
    result = Math.round(amount * (rates.uzs / rates.eur));
    ctx.reply(`💰 ${amount} EUR = ${result.toLocaleString("ru-RU")} UZS`, mainMenu);
  } else if (["rubl", "rub"].includes(cur)) {
    result = Math.round(amount * (rates.uzs / rates.rub));
    ctx.reply(`💰 ${amount} RUB = ${result.toLocaleString("ru-RU")} UZS`, mainMenu);
  }
});

bot.launch();
console.log("💰 Valyuta boti ishga tushdi! Menu tayyor!");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));