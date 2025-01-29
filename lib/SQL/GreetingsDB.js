const CONFIG = require("../../config");
const { DataTypes } = require("sequelize");

const GreetingsDB = CONFIG.APP.POST_GET.define("Greetings", {
  chatId: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  switchs: { type: DataTypes.BOOLEAN, defaultValue: CONFIG.APP.WELCOME },
  switcho: { type: DataTypes.TEXT, allowNull: true },
  w_msg: { type: DataTypes.BOOLEAN, defaultValue: CONFIG.APP.GOODBYE },
  g_msg: { type: DataTypes.TEXT, allowNull: true },
});


GreetingsDB.toggle = async (chatId, type, status) => {
  if (!["welcome", "goodbye"].includes(type)) return "use 'welcome' or 'goodbye'";
  await GreetingsDB.upsert({ chatId, [`${type}Enabled`]: status });
  return `${type.charAt(0).toUpperCase() + type.slice(1)} messages are now ${status ? "enabled ✅" : "disabled ❌"}`;
};

module.exports = GreetingsDB;
  
