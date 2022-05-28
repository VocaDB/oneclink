const Config = {
  vocadb: new function () {
    this.BASE_URL = 'https://vocadb.net/'
    this.API_BASE_URL = this.BASE_URL + 'api'
  },
  youtube: new function () {
    this.BASE_URL = 'https://www.youtube.com/'
    this.VIDEO_BASE_URL = this.BASE_URL + 'watch'
  },
  niconico: new function () {
    this.BASE_URL = 'https://www.nicovideo.jp/'
    this.VIDEO_BASE_URL = this.BASE_URL + 'watch'
  },
}

function setBadge(tab) {
  chrome.action.setBadgeText({ text: "x", tabId: tab.id })
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith(Config.youtube.VIDEO_BASE_URL) || tab.url.startsWith(Config.niconico.VIDEO_BASE_URL)) {
    fetch(Config.vocadb.API_BASE_URL + '/songs?query=' + tab.url + '&fields=PVs', {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Oneclink Chrome Extension'
      }
    })
      .then(response => response.json())
      .then(response => response['items'][0])
      .then(response => redirect(tab, response))
  }
  else { setBadge(tab) }
})

function redirect(tab, response) {
  if (response === undefined) { setBadge(tab) }
  else {
    if (tab.url.startsWith(Config.youtube.VIDEO_BASE_URL)) { var service = "NicoNicoDouga" }
    else { var service = "Youtube" }
    for (pv of response["pvs"]) {
      if (pv["pvType"] == "Original") {
        if (pv["service"] == service) {
          chrome.tabs.update(tab.id, { url: pv["url"] })
          return
        }
      }
    }
    setBadge(tab)
  }
}