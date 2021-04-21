const eco = require('../../functions/economy');
const coin_gif = '<a:coin:710976678561841153>';
const random = ['tài', 'xỉu'];
const dict = {
    'tài': '<:tài:777374678121316364>',
    'xỉu': '<:xỉu:777374678129967144>',
};
const { laysodep, sleep } = require('../../functions/utils');
const maxBet = 9999999999999999;
module.exports = {
    name: 'coinflip',
    aliases: ['cf'],
    cooldown: 5,
    category: 'gamble',
    description: 'Tung đồng xu (50%)',
    usage: '<PREFIX>coinflip <Lựa chọn của bạn> <tiền cược>',
    example: '<PREFIX>coinflip t 50000',
    run: async (client, message, args) => {
        let user_choose = args[0].toLowerCase();
        if (!user_choose || !isNaN(user_choose)) return message.channel.send('Vui lòng chọn tài hoặc xỉu.');
        switch(user_choose) {
            case 'x':
                user_choose = 'xỉu';
                break;
            case 'xỉu':
                user_choose = 'xỉu';
                break;
            case 't':
                user_choose = 'tài';
                break;
            case 'tài':
                user_choose = 'tài';
                break;
            default:
                user_choose = 'tài';
                break;
        }
        const amount = await eco.fetchMoney(message.author.id);
        if (amount == 0) return message.channel.send('Bạn không có tiền để chơi!');
        let bet = 1;
        if (!args[1]) return message.channel.send('Vui lòng nhập tiền cược');
        if (!isNaN(args[1])) bet = parseInt(args[1]);
        if (args[1].toLowerCase() == 'all') {
           if (maxBet > amount) bet = amount;
           else bet = maxBet;
        }
        else if (!amount) return message.channel.send('Vui lòng nhập tiền cược');
        if (bet == 0) return message.channel.send('Bạn không thể cược 0');
        if (bet > maxBet) bet = maxBet;
        if (bet > amount) return message.channel.send('Bạn không đủ tiền để chơi');
        await message.channel.send(`${coin_gif} **${message.author.tag}** cược **${laysodep(bet)}** và đã chọn **${user_choose.toUpperCase()}**!`);
        // random
        const userrand = random[Math.floor(Math.random() * random.length)];
        console.log(userrand);
        const final = check(user_choose, userrand);
        await sleep(4000);
        if (final === true) {
            // win
            message.channel.send(`Và kết quả là (**${userrand.toUpperCase()}**), bạn đã thắng **${laysodep(bet)}**.`);
            await money(message.author.id, 'win', bet);
        } else if (final === false) {
            // lose
            message.channel.send(`Và kết quả là (**${userrand.toUpperCase()}**), bạn đã mất hết tiền cược.`);
            await money(message.author.id, 'lose', bet);
        } else {
            // k trừ tiền
            message.channel.send('Bot lỗi, bạn sẽ không bị trừ tiền!');
        }
    },
};

function check(user_choose, userrand) {
    if (!user_choose || !userrand) return null;
    if (user_choose == userrand) return true;
    else return false;
}

async function money(userid, kind, bet) {
    if (!userid || !bet) return null;
    if (kind == 'win') {
        await eco.addMoney(userid, bet);
    } else {
        await eco.subtractMoney(userid, bet);
    }
}