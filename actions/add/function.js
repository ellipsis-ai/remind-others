function(users, message, days, time, channel, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis);
const moment = require('moment-timezone');

const timeString = moment(time).tz(ellipsis.team.timeZone).format('h:mm:ss a');
const recurrence = `${days.recurrence} at ${timeString}`;
const usersMentioned = ellipsis.event.message ? ellipsis.event.message.usersMentioned : [];
const userLinks = usersMentioned.map(ea => ea.formattedLink).join(" ");

api.schedule({
  actionName: 'run',
  args: [ 
    { name: 'message', value: message },
    { name: 'users', value: userLinks }
  ],
  channel: channel,
  recurrence: recurrence
}).then(res => {
  const scheduled = res.scheduled;
  if (scheduled) {
    const schedulingLink = `${ellipsis.apiBaseUrl}/scheduling?channelId=${scheduled.channel}&teamId=${ellipsis.team.ellipsisTeamId}`;
    ellipsis.success({
      userLinks: userLinks,
      recurrence: scheduled.recurrence,
      firstRecurrence: scheduled.firstRecurrence,
      secondRecurrence: scheduled.secondRecurrence,
      channel: scheduled.channel,
      schedulingLink: schedulingLink
    });
  } else {
    ellipsis.error(res, { userMessage: "I wasn't able to set up this reminder" });
  }  
});
}
