const autoRefreshAlertList = () => {
  isUpdatePossible = () => {
    //check we are on alert-list
    if (!document.getElementById('alert-list')) {
      return false;
    }

    //search dialog open
    if (!(window.getComputedStyle(document.getElementById('assistant-frame')).display === 'none')) {
      return false;
    }

    //serch bar has focus
    if (document.querySelector('#editorA.ace_focus')) {
      return false;
    }

    return true;
  }

  notificationIfAlerts = () => {
    return countOpenedAlerts() === 1 ? singleAlertNotification() : multipleAlertsNotification()
  }

  hasOpenedAlerts = () => {
    return document.querySelector('div.alert-list-item-vue-cover') !== null
  }

  countOpenedAlerts = () => {
    return document.querySelectorAll('div.alert-list-item-vue-cover .og-alert-item').length
  }

  getLastOpenedAlert = () => {
    let lastAlert = document.querySelector('div.alert-list-item-vue-cover')

    return {
      title: lastAlert.querySelector('.og-alert-item__main__title-box__title').innerText,
      tags: lastAlert.querySelector('.og-alert-item__main__tag-box').innerText.replace(/\n\n/g, ', '),
      isOpen: lastAlert.querySelector('.og-alert-item__right__status-box__status').innerText === 'Open'
    }
  }

  countNotAckAlerts = () => {
    return Array.prototype.filter.call(document.querySelectorAll('div.alert-list-item-vue-cover .og-alert-item .og-alert-item__right__status-box__status'), (status) => {
      return status.innerText === 'OPEN'
    }).length
  }

  singleAlertNotification = () => {
    let lastAlert = getLastOpenedAlert()

    if (lastAlert.isOpen) {
      triggerNotification(lastAlert.tags, lastAlert.title)
    }
  }

  multipleAlertsNotification = () => {
    if ((notAck = countNotAckAlerts()) > 0) {
      triggerNotification('', notAck + ' opened and not acknowledged alerts')
    }
  }

  triggerNotification = (context, body) => {
    chrome.runtime.sendMessage('', {
      context: context,
      body: body
    })
  }

  return ({
    autoRefresh: () => {
      if (isUpdatePossible()) {
        document.querySelector('div.og-saved-search__list__section__content__item--active').click();

        if (hasOpenedAlerts()) {
          notificationIfAlerts();
        }
      }
    }
  })
};

setInterval(autoRefreshAlertList().autoRefresh, 10000);
