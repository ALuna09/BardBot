import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

// const dice = ["d4", "d6", "d8", "d10", "d12", "d20", "%"];
const diceRoll = (num) => {
  if(num === '%')  return `You rolled a(n) ${Math.floor(Math.random() * 10)}0%.`;

  return `You rolled a(n) ${Math.floor(Math.random() * num) + 1}.`;
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.MessageContent
  ] 
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
  if (message.content.startsWith("!roll")) {
    message.reply("rolling");
    const dieOfChoice = message.content.split(' ')[1];
    switch (dieOfChoice) {
      case "d4":
        message.channel.send(diceRoll(4));
        break;
      case "d6":
        message.channel.send(diceRoll(6));
        break;
      case "d8":
        message.channel.send(diceRoll(8));
        break;
      case "d10":
        message.channel.send(diceRoll(10));
        break;
      case "d12":
        message.channel.send(diceRoll(12));
        break;
      case "d20":
        message.channel.send(diceRoll(20));
        break;
      case "%":
        message.channel.send(diceRoll('%'));
        break;
      default:
        message.channel.send("Not a valid die");
        break;
    }
  } 
});

client.login(process.env.BOT_TOKEN);