import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

const {BASE_URL} = process.env;
const diceRoll = (dieType) => { // Dice rolling helper function
  if(dieType === '%') {
    let roll = Math.floor(Math.random() * 10);
    return `You rolled ${roll === 8 ? 'an' : 'a'} ${roll}0.`;
  } else if(dieType === 10) {
    let roll = Math.floor(Math.random() * 10);
    return  `You rolled ${roll === 8 ? 'an' : 'a'} ${roll}.`;
  } else {
    let roll = Math.floor(Math.random() * dieType) + 1;
    let particle = roll === 8 || roll === 18 || roll === 11 ? `an` : `a`;
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

client.on(`ready`, (ready) => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(`messageCreate`, (message) => { // Message detector + response
  const triggeredCommand = message.content.split(' ')[1];

  if (message.content.startsWith(`!roll`)) { // Handle rolls
    let rollTheDice = (die) => {
      message.reply(`Rolling!`);
      message.channel.send(diceRoll(die));
    }

    switch (triggeredCommand) {
      case "d4":
        rollTheDice(4);
        break;
      case "d6":
        rollTheDice(6);
        break;
      case "d8":
        rollTheDice(8);
        break;
      case "d10":
        rollTheDice(10);
        break;
      case "d12":
        rollTheDice(12);
        break;
      case "d20":
        rollTheDice(20);
        break;
      case "%":
        rollTheDice('%');
        break;
      case "help":
        message.reply(`Valid commands:\nd4, d6, d8, d10, d12, d20, %`);
        break;
      default:
        message.channel.send(`Not a valid die.\nIf you need a list of valid commands type "help" after the "!roll" trigger.👌`);
        break;
    }
  } else if (message.content.startsWith(`!skill`)) { // Handle skill descriptions
    fetch(`${BASE_URL}/skills/${triggeredCommand}`)
    .then(res => res.json())
    .then(data => {
      message.channel.send(`Here's the description for ${data.name}:\n${data.desc[0]}`);
    })
    .catch(err => {
      console.error(err)
      
      fetch(`${BASE_URL}/skills`) // Nested fetch to get all the valid skills
      .then(res => res.json())
      .then(data => {
        let listedSkills = [];
        
        for (let skillObj of data.results) { // loop to populate listedSkills array
          listedSkills.push(skillObj.index);
        }
        
        message.channel.send(`Seems we couldn't find anything for "${triggeredCommand}"\nHere are the valid skill commands:\n${listedSkills.join('\n')}`);
      })
      .catch(err => console.error(err));
    });
  } else if (message.content.startsWith(`!ability`)) { // Handle ability descriptions
    fetch(`${BASE_URL}/ability-scores/${triggeredCommand}`)
    .then(res => res.json())
    .then(data => {
      let relatedSkills = []
      for(let skill of data.skills) { // Populate related skills arr
        relatedSkills.push(skill.name);
      }
      message.channel.send(
        `Here's the description, and relevant skills for ${data.name}:\n
        Description:\n${data.desc[0]}\n
        Skills:\n${relatedSkills.join('\n')}`
        )
    })
    .catch(err => {
      console.error(err);

      fetch(`${BASE_URL}/ability-scores`)
      .then(res => res.json())
      .then(data => {
        let abilities = [];

        for(let ability of data.results) {
          abilities.push(ability.index);
        }

        message.channel.send(`Seems we couldn't find anything for "${triggeredCommand}"\nHere are the valid ability commands:\n${abilities.join('\n')}`);
      })
      .catch(err => console.error(err));
    })
  } else if (message.content.startsWith(`!alignment`)) { // Handle alignment descriptions
    fetch(`${BASE_URL}/alignments/${triggeredCommand}`)
    .then(res => {
      res.json()
      if(res.status === 404) throw new Error('Something went wrong'); // Force going to catch statement if 404
    })
    .then(data => {
      message.channel.send(`Here's the description for ${data.name}:\n${data.desc}`)
    })
    .catch(err => {
      console.error(err);

      fetch(`${BASE_URL}/alignments`)
      .then(res => res.json())
      .then(data => {
        let alignments = [];
  
        for(let alignment of data.results) {
          alignments.push(alignment.index);
        }

        message.channel.send(`Seems we couldn't find anything for "${triggeredCommand}"\nHere are the valid alignment commands:\n${alignments.join('\n')}`)
      })
      .catch(err => console.error(err));

    })
  }
});

client.login(process.env.BOT_TOKEN); // Bot login