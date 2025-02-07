const { CreatePlug } = require('../lib/commands');

CreatePlug({
    command: 'block',
    category: 'admin',
    desc: 'Block a user',
    execute: async (message, conn) => {
        if(!message.isFromMe) return;
        let target = message.quoted ? message.sender: !message.isGroup: false; 
        if (!target) return conn.sendMessage(message.user, { text: 'Please reply to a user' });
        await conn.updateBlockStatus(target, 'block');
        conn.sendMessage(message.user, { text: `_Blocked_ @${target.split('@')[0]}`, mentions: [target] });
    }
});
          
CreatePlug({
    command: 'unblock',
    category: 'admin',
    desc: 'Unblock a user',
    execute: async (message, conn) => {
        if(!message.isFromMe) return;
        let target = message.quoted ? message.quoted.participant : message.mentions.length > 0 ? message.mentions[0] : message.sender;
        if (!target) return conn.sendMessage(message.user, { text: 'Please reply to a user' });
        await conn.updateBlockStatus(target, 'unblock');
        conn.sendMessage(message.user, { text: `_Unblocked_ @${target.split('@')[0]}`, mentions: [target] });
    }
});
                                        
