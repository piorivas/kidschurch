function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  template.pathInfo = e.pathInfo;

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