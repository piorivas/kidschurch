function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  template.pathInfo = e.pathInfo;

  if (e.pathInfo && e.pathInfo.startsWith('json')) {
    var jsonResponse = 
      {
        0: {
          "type":0,
          "content":"My Title",
          "bold":1,
          "align":2,
          "format":3
        }
      }
    ;
    return ContentService.createTextOutput(JSON.stringify(jsonResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Convert query string into path
  if (e.queryString) {
    const params = e.queryString.split('&').map(param => param.split('='));
    const path = params.map(param => `${param[0]}/${param[1]}`).join('/');
    template.pathInfo = path;
  }

  return template.evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getAppsScriptUrl() {
  return ScriptApp.getService().getUrl();
}