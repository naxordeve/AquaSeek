const { CreatePlug } = require('../lib/commands');

CreatePlug({
    command: 'block',
    category: 'admin',
    desc: 'Block a user',
    execute: async (message, conn) => {
        if (!message.isFromMe) return;
        let target = message.quoted 
            ? message.quoted.sender 
            : !message.isGroup 
                ? message.user 
                : false;

        if (!target) return conn.sendMessage(message.user, { text: 'Please reply to a user' });
        await conn.updateBlockStatus(target, 'block');
        conn.sendMessage(message.user, { 
            text: `_Blocked_ @${target.split('@')[0]}`, 
            mentions: [target] 
        });
    }
});

          
