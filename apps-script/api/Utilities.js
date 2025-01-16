var utils = {
  dateFormat: { year: 'numeric', month: 'long', day: '2-digit' },
  timeFormat: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
  dateTimeFormat: { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' },
  colCount: function colCount(sheet) {
    if (cache[sheet] && cache[sheet].colCount) {
      return cache[sheet].colCount;
    }
    var colCount = sheet.getLastColumn();
    if (!cache[sheet]) {
      cache[sheet] = {};
    }
    cache[sheet].colCount = colCount;
    return colCount;
  },

  headers: function headers(sheet) {
    if (cache[sheet] && cache[sheet].headers) {
      return cache[sheet].headers;
    }
    var headers = sheet.getRange(1, 1, 1, utils.colCount(sheet)).getValues()[0];
    if (!cache[sheet]) {
      cache[sheet] = {};
    }
    cache[sheet].headers = headers;

    return headers;
  },

  properCase: function properCase(string = '') {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  },

  getLevel: function getLevel(birthday) {
    if (!birthday) {
      return "Unknown";
    }
    var birthDate = new Date(birthday);
    if (!cache.levels){
      let levelsSheet = spreadsheet.getSheetByName("levels");
      cache.levels = {};
      cache.levels.minAgeRange = levelsSheet.getRange(2, 1, levelsSheet.getLastRow() - 1, 1).getValues();
      cache.levels.maxAgeRange = levelsSheet.getRange(2, 2, levelsSheet.getLastRow() - 1, 1).getValues();
      cache.levels.valuesRange = levelsSheet.getRange(2, 3, levelsSheet.getLastRow() - 1, 1).getValues();
    }
    let age = new Date().getFullYear() - birthDate.getFullYear();
    var m = new Date().getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate())) {
      age--;
    }
    for (var i = 0; i < cache.levels.minAgeRange.length; i++) {
      if (age >= cache.levels.minAgeRange[i] && age <= cache.levels.maxAgeRange[i]) {
        return cache.levels.valuesRange[i][0];
      }
    }

    return "Unknown";
  }
};