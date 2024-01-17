import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

const diceRoll = (dieType) => { // Dice rolling helper function
  if(dieType === '%') {
    let roll = Math.floor(Math.random() * 10);
    return `You rolled ${roll === 8 ? 'an' : 'a'} ${roll}0.`;
  } else if(dieType === 10) {
    let roll = Math.floor(Math.random() * 10);
    return  `You rolled ${roll === 8 ? 'an' : 'a'} ${roll}.`;
  } else {
    let roll = Math.floor(Math.random() * dieType) + 1;
    let particle = roll === 8 || roll === 18 || roll === 11 ? 'an' : 'a';
    return `You rolled ${particle} ${roll}.`;
  }
};

const client = new Client({ // Create the actual bot with desired access(intents)
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.MessageContent
  ] 
});

client.on('ready', (ready) => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => { // Message detector + response
  if (message.content.startsWith("!roll")) { // Handle rolls
    message.reply(`Rolling!`);

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
      case "help":
        message.reply(`Valid commands:\nd4, d6, d8, d10, d12, d20, %`);
        break;
      default:
        message.channel.send(`Not a valid die.\nIf you need a list of valid commands type "help" after the "!roll" trigger.👌`);
        break;
    }
  } else if (message.content.startsWith(`!skill`)) { // Handle skill descriptions
    const queriedSkill = message.content.split(' ')[1];
    
    fetch(`${process.env.BASE_URL}/skills/${queriedSkill}`)
    .then(res => res.json())
    .then(data => {
      message.channel.send(`Here's the description for ${queriedSkill}:\n${data.desc[0]}`);
    })
    .catch(err => {
      console.error(err)
      
      fetch(`${process.env.BASE_URL}/skills`) // Nested fetch to get all the valid skills
      .then(res => res.json())
      .then(data => {
        let listedSkills = [];
        
        for (let skillObj of data.results) { // loop to populate listedSkills array
          listedSkills.push(skillObj.index);
        }
        
        message.channel.send(`Seems we couldn't find anything for "${queriedSkill}"\nHere are the valid skills:\n${listedSkills.join('\n')}`);
      });
    });
  } //else if ()
});


client.login(process.env.BOT_TOKEN); // Bot login