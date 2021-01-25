chrome.browserAction.onClicked.addListener(() =>
  chrome.tabs.executeScript(null, { file: 'alertautorefresh.js' })
);

const raiseNotification = (request) => {
  return chrome.notifications.create('', {
    type: 'basic',
    iconUrl: 'assets/128x128.png',
    title: 'Opsgenie Alert',
    message: request.body,
    contextMessage: request.context
  })
}

chrome.runtime.onMessage.addListener((request, sender, callback) => {
  callback(raiseNotification(request))
});
