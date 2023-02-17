const { Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "ready",
  /**
   * @param {Client} client
   * @param {Guild} guild
   */
  async execute(client) {
    setInterval(async () => {
      const guild = client.guilds.cache.get("702545447750860931"); // webex mas aqui!
      await guild.members.fetch();
      /* const trainees = guild.roles.cache.get("946525021545828422");
      traineesArr = [];
      if (trainees.members.size === 0) {
        traineesArr.push(
          "There is currently no staff member in the position of `Trainee Moderator`."
        );
      } else {
        trainees.members.forEach(async (m) => {
          if (!m.presence || m.presence.status === "offline") {
            traineesArr.push(`<:offline:1075135631484784651> ${m.user}\n`);
          } else if (m.presence.status === "online") {
            traineesArr.push(`<:online:1075135601717809173> ${m.user}\n`);
          } else if (m.presence.status === "dnd") {
            traineesArr.push(`<:dnd:1075135660018634823> ${m.user}\n`);
          } else if (m.presence.status === "idle") {
            traineesArr.push(`<:idle:1075135563126018120> ${m.user}\n`);
          }
        });
      } */
      const staff = guild.roles.cache.get("724629524180107304");
      staffArr = [];
      if (staff.members.size === 0) {
        staffArr.push(
          "There is currently no staff member in the position of `Staff`."
        );
      } else {
        staff.members.forEach(async (m) => {
          if (!m.presence || m.presence.status === "offline") {
            staffArr.push(`<:offline:1075135631484784651> ${m.user}\n`);
          } else if (m.presence.status === "online") {
            staffArr.push(`<:online:1075135601717809173> ${m.user}\n`);
          } else if (m.presence.status === "dnd") {
            staffArr.push(`<:dnd:1075135660018634823> ${m.user}\n`);
          } else if (m.presence.status === "idle") {
            staffArr.push(`<:idle:1075135563126018120> ${m.user}\n`);
          }
        });
      }
      const admin = guild.roles.cache.get("939497997442641960");
      adminArr = [];
      if (admin.members.size === 0) {
        adminArr.push(
          "There is currently no staff member in the position of `Admin`."
        );
      } else {
        admin.members.forEach(async (m) => {
          if (!m.presence || m.presence.status === "offline") {
            adminArr.push(`<:offline:1075135631484784651> ${m.user}\n`);
          } else if (m.presence.status === "online") {
            adminArr.push(`<:online:1075135601717809173> ${m.user}\n`);
          } else if (m.presence.status === "dnd") {
            adminArr.push(`<:dnd:1075135660018634823> ${m.user}\n`);
          } else if (m.presence.status === "idle") {
            adminArr.push(`<:idle:1075135563126018120> ${m.user}\n`);
          }
        });
      }
      const owner = guild.roles.cache.get("723282558686855218");
      ownerArr = [];
      if (owner.members.size === 0) {
        ownerArr.push(
          "There is currently no staff member in the position of `Owner/ Head Admin`."
        );
      } else {
        owner.members.forEach(async (m) => {
          if (!m.presence || m.presence.status === "offline") {
            ownerArr.push(`<:offline:1075135631484784651> ${m.user}\n`);
          } else if (m.presence.status === "online") {
            ownerArr.push(`<:online:1075135601717809173> ${m.user}\n`);
          } else if (m.presence.status === "dnd") {
            ownerArr.push(`<:dnd:1075135660018634823> ${m.user}\n`);
          } else if (m.presence.status === "idle") {
            ownerArr.push(`<:idle:1075135563126018120> ${m.user}\n`);
          }
        });
      }
      staffArr = staffArr.toString().replaceAll(",", "");
      adminArr = adminArr.toString().replaceAll(",", "");
      ownerArr = ownerArr.toString().replaceAll(",", "");
      const channel = guild.channels.cache.get("1075153371155157112"); // staff list
      channel.messages.fetch("1075153715473944659").then((m) => {
        try {
          m.edit({
            content: `
These are the current staff members of Webex mas aqui!, their positions and their status.
**Owners:**
> These are the people that own the discord server.
${ownerArr}
**Admins:**
> These are the people that help and manage the discord server, and select new staff members.
${adminArr}
**Staff:**
> These are the people who moderate the server and have passed the training period.
${staffArr}
> If you have any questions about the server or/and if you have any questions about <@747412110782234654> feel free to DM <@453944662093332490>.
Last updated at <t:${Math.floor(Date.now() / 1000)}>.
          `,
          });
        } catch (e) {
          console.log(e);
        }
      });
    }, 6 * 3600 * 1000); // 15000
  },
};