require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();
const TOKEN = process.env.TOKEN;

console.log('logging in');

client.login(TOKEN);

client.on('ready', () => {
    console.info(`Logged in as ${client.user.tag}!`);
});

let participants = [];
let winners = [];

client.on('message', message => {
    if (message.author.bot) return;

    if( //(message.author.id===message.guild.owner.id) ||
        (message.member.roles.find(r => r.name === "娘娘")) ||
        (message.member.roles.find(r => r.name === "抽獎小職員")) ){

        if (message.content === 'ping') {
            message.reply('pong');
        } else if (message.content === 'help') {
            var embed = new Discord.RichEmbed()
                .addField("start", "開始新抽獎")
                .addField("list", "查看中獎名單跟抽獎名單")
                .addField("add 人名,人名", "加入參加者，用逗號分隔")
                .addField("抽 3", "抽+數字進行抽獎!");
            message.channel.send(embed);
        } else if (message.content === 'start' || message.content === 'restart') {
            if(message.content === 'start' && (participants.length>0 || winners.length>0)){
                message.reply("有進行中的抽獎喔～！輸入`['restart']`來重新開始～！");
            } else {
                participants.length=0;
                winners.length=0;
                message.channel.send('哎呀！你好～你好～！走過，經過，不要錯過喔！\r\n' +
                    '猛男執樹枝限定！來這裡參加九尾抽獎活動吧！能抽中令人開心的獎品喔～！\r\n' +
                    "一次只要500鈴錢！要來試試手氣嗎～？！\r\n`['add ' + 人名(用','分隔)]`");
            }
        } else if (message.content === 'list') {
            let winnerList = '還沒有喔～！';
            if(winners.length>0){
                winnerList = winners.reduce((accumulator, currentValue, currentIndex) => {
                    return accumulator + '\r\n第' + (currentIndex+1) + '期: ' + currentValue.join(', ')
                }, '');
            }

            message.channel.send('中獎名單：'+winnerList);
            message.channel.send('現在抽獎名單：'+participants.length+((participants.length>0)?'\r\n有：'+participants.join(', '):''));
            if(participants.length>0)
                message.channel.send("來來來，要抽獎的人，請從這個箱子抽出來！\r\n`['抽' + 人數]`");
            else
                message.channel.send("來來來，要抽獎的人，請從這個箱子抽出來！\r\n`['add ' + 人名(用','分隔)]`");

        } else if (message.content.startsWith('add ')) {
            let namelistRaw = message.content.substring(4).split(',');
            if(namelistRaw.length>0){
                let safeSwitch=100, counter=0;
                namelistRaw.forEach(value=>{

                    counter++;
                    if(counter>safeSwitch) {
                        message.channel.send('每次最多加入100位參加者喔～！');
                        return;
                    }
                    let temp = value.replace(/ /g,"");
                    if(temp.length>0){
                        participants.push(temp);
                    }
                });
                message.channel.send('現在抽獎名單：'+participants.length+((participants.length>0)?'\r\n有：'+participants.join(', '):''));
                message.channel.send("謝謝惠顧～！那麼，請抽一張。\r\n`['抽' + 人數]`");

            } else {
                message.reply('很抱歉～！要告訴我參加者名字喔～！');
            }

        } else if (message.content.startsWith('抽')) {
            console.log('draw!');

            let arg = parseInt(message.content.replace('抽','').replace(' ',''));
            if(participants.length<1){
                message.reply("很抱歉～！這裡還沒準備好喔～！\r\n等加入參加者就會開始營業，還請您耐心等候～！\r\n`['add ' + 人名(用','分隔)]`");
            }else if(isNaN(arg)){
                message.reply("很抱歉～！要告訴我抽獎人數～！無法抽獎喔～！\r\n`['抽' + 人數]`");
            } else if(arg<1) {
                message.reply("很抱歉～！最少抽出1人，無法抽出'+arg+'人喔～！\r\n`['抽' + 人數]`");
            }else if(arg>participants.length){
                message.reply("很抱歉～！抽獎人數多於參加人數，無法抽獎喔～！");
            }else{
                let thisWinners=[];
                for(let counter=0;counter<arg;counter++){
                    let winId=Math.floor(Math.random()*participants.length);
                    let winner = participants.splice(winId,1);
                    winner=winner[0];
                    thisWinners.push(winner);
                }
                winners.push(thisWinners);

                message.channel.send(':ballot_box: :ballot_box: ');
                message.channel.send('我看看......');
                message.channel.send('出現了！'+(Math.floor(Math.random()*8+1)).toString()+'號！\r\n得獎者是 '+(thisWinners.join(', '))+' ～！');

                message.channel.send(':confetti_ball: :confetti_ball: :confetti_ball: ');

                if(participants.length>0)
                    message.channel.send("這位客人，您的運氣很好耶。再抽一次要500鈴錢，要試試看嗎？\r\n`['抽' + 人數]`");
            }

        }

    }

});
