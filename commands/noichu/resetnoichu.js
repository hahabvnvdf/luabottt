const { getChannel,updateNoiTu } = require('../../functions/utils');
module.exports = {
    name: 'resetnoichu',
    aliases: ['rsnoichu'],
    category: 'noichu',
    description: 'Reset nối chữ',
    usage: '<PREFIX>rsnoichu',
    run: async (client, message, args, guildDb) => {
        const channel = await getChannel(message, args.join(' '), false);
        await updateNoiTu(message.guild.id, guildDb.maxWords, channel.id);

        message.channel.send('✅ | Thao tác thành công!');
    },
};