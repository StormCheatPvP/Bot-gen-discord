// DEPENDENCIAS :
const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const CatLoggr = require('cat-loggr');

// FUNÇÕES
const client = new Discord.Client();
const log = new CatLoggr();

// COLEÇÕES NOVAS DO DISCORD
client.commands = new Discord.Collection();

// LOGANDO
if (config.debug === true) client.on('debug', stream => log.debug(stream)); // SE DEBUG HABILITADO NAS CONFIGURAÇÕES
client.on('warn', message => log.warn(message));
client.on('error', error => log.error(error));

// CARREGAR COMANDOS DA PASTA
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // DIRETÓRIO DO COMANDO.
for (const file of commandFiles) {
  const command = require(`./commands/${file}`); // CARREGAR O COMANDO
  log.init(`Carreguei o comando ${file.split('.')[0] === command.name ? file.split('.')[0] : `${file.split('.')[0]} as ${command.name}`}`); // Logging to console
  client.commands.set(command.name, command); // SETAR COMANDO POR COLEÇÃO DE COMANDOS DO DISCORD !
};

// LOGIN
client.login(config.token);

client.once('ready', () => {
  log.info(`Eu estou logado em ${client.user.tag} no Discord!`); // DIZER OI NO CONSOLE
  client.user.setActivity(`Gerando contas ELX </>`, { type: "WATCHING", url: "https://twitch.tv/stormtwitch12312" }); // SETAR STATUS DO BOT NO DISCORD
  /* OS TIPOS DE STATUS QUE VOCÊ PODE SETAR !:
   * LISTENING
   * WATCHING
   * COMPETING
   * STREAMING (AI VOCÊ COLOCA twitch.tv url DEPOIS TIPO ASSIM:   { type: "STREAMING", url: "https://twitch.tv/twitch_nick_aqui"} )
   * PLAYING (default)
  */
});

client.on('message', (message) => {
  if (!message.content.startsWith(config.prefix)) return; // SE A MENSAGEM NÃO FOR ENVIADA PELO PREFIXO 
  if (message.author.bot) return; // SE O COMANDO FOR DITO PELO BOT

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // SE O COMANDO NÃO EXISTE
  if (config.command.notfound_message === true && !client.commands.has(command)) {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setColor(config.color.red)
        .setTitle('Comando não existe ! :(')
        .setDescription(`Desculpa, mas não consigo achar o \`${command}\` comando !`)
        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
        .setTimestamp()
    );
  };

  // EXECUTANDO O COMANDO
  try {
    client.commands.get(command).execute(message, args); // EXECUTAR
  } catch (error) {
    log.error(error); // ERRO LOGIN

    // MANDAR MENSAGEM DE ERRO SE "error_message" FOR "true" NA CONFIGURAÇÃO
    if (config.command.error_message === true) {
      message.channel.send(
        new Discord.MessageEmbed()
          .setColor(config.color.red)
          .setTitle('Ocorreu um erro ! Auth.')
          .setDescription(`Um erro ocorreu enquanto executava \`${command}\` comando!`)
          .addField('Erro', `\`\`\`js\n${error}\n\`\`\``)
          .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
          .setTimestamp()
      );
    };
  };
});
