// Dependencies
const { MessageEmbed, Message } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const CatLoggr = require('cat-loggr');

// Functions
const log = new CatLoggr();

module.exports = {
	name: 'create', // Nome do comando
	description: 'Criar novo servico.', // Descricao do comando

    /**
     * Command exetute
     * @param {Message} message The message sent by user
     * @param {Array[]} args Arguments splitted by spaces after the command name
     */
	execute(message, args) {
        // Parametros
        const service = args[0];

        // Se o parametro "conta" estiver faltando
        if (!service) {
            return message.channel.send(
                new MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Faltando parametros!')
                .setDescription('Você precisa dar o nome do serviço !')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
        };

        // Lugar onde será criado a pasta do novo serviço !
        const filePath = `${__dirname}/../stock/${args[0]}.txt`;

        // Criar nova pasta
        fs.writeFile(filePath, '', function (error) {
            if (error) return log.error(error); // If an error occured, log to console

            message.channel.send(
                new MessageEmbed()
                .setColor(config.color.green)
                .setTitle('Servico criado com sucesso !')
                .setDescription(`Novo ${args[0]} servico criado!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
            );
        });
    }
};
