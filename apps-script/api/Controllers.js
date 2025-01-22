function createRow(entity, data) {
  if (!hasAccess(jwtToken, entity, 'create')) {
    throw new Error('Unauthorized');
  }
  const sheet = spreadsheet.getSheetByName(entity);
  if (sheet === null) {
    throw new Error(utils.properCase(entity) +' sheet not found');
  }

  var row = sheet.getLastRow() + 1;
  var headers = utils.headers(sheet);
  var range = sheet.getRange(row, 1, 1, headers.length);
  var values = headers.map(header => {
    if (header === 'status' && !data[header]) {
      return 'Active';
    }
    if (header === 'time') {
      return Utilities.parseDate(data[header], "Asia/Manila", "hh:mm:ss a");
    }
    return data[header] || '';
  });
  range.setValues([values]);

  return transform(entity, values, row - 1, headers);
}

function createUniqueRow(entity, data, index) {
  if (!hasAccess(jwtToken, entity, 'create')) {
    throw new Error('Unauthorized');
  }
  const sheet = spreadsheet.getSheetByName(entity);
  if (sheet === null) {
    throw new Error(utils.properCase(entity) +' sheet not found');
  }

  const headers = utils.headers(sheet);
  const colIndex = headers.indexOf(index) + 1;
  if (colIndex === 0) {
    throw new Error('Invalid index column');
  }

  const dataRange = sheet.getDataRange().getValues();
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][colIndex - 1] === data[index]) {
      throw new Error('Record with the same ' + index + ' already exists');
    }
  }

  // Check if password exists and hash it
  if (data.password) {
    data.password = generatePasswordHash(data.password);
  }

  createRow(entity, data);
}

function updateRow(entity, data) {
  if (!hasAccess(jwtToken, entity, 'update')) {
    throw new Error('Unauthorized');
  }
  const sheet = spreadsheet.getSheetByName(entity);
  if (sheet === null) {
    throw new Error(utils.properCase(entity) +' sheet not found');
  }

  var id = parseInt(data.id, 10);
  if (id === '' || id === undefined || !Number.isInteger(id)) {
    throw new Error('Invalid id field');
  }
  //skip the header row
  const row = id + 1;
  const cols = utils.colCount(sheet);
  const headers = utils.headers(sheet);
  const range = sheet.getRange(row, 1, 1, cols);
  var rowValues = range.getValues();
  var values = headers.map(header => data[header] || rowValues[0][headers.indexOf(header)]);
  range.setValues([values]);

  return transform(entity, data, id, headers);
}

function updateUniqueRow(entity, data, index) {
  if (!hasAccess(jwtToken, entity, 'update')) {
    throw new Error('Unauthorized');
  }
  const sheet = spreadsheet.getSheetByName(entity);
  if (sheet === null) {
    throw new Error(utils.properCase(entity) +' sheet not found');
  }
  var id = parseInt(data.id, 10);

  if (id === '' || id === undefined || !Number.isInteger(id)) {
    throw new Error('Invalid id field');
  }
  const headers = utils.headers(sheet);
  const colIndex = headers.indexOf(index) + 1;
  if (colIndex === 0) {
    throw new Error('Invalid index column');
  }

  const dataRange = sheet.getDataRange().getValues();
  for (let i = 1; i < dataRange.length; i++) {
    if (i !== id && dataRange[i][colIndex - 1] === data[index]) {
      throw new Error('Record with the same ' + index + ' already exists');
    }
  }

  updateRow(entity, data);
}

function updateRowProfile(entity, data) {
  var id = parseInt(data.id, 10);
  if (id === '' || id === undefined || !Number.isInteger(id)) {
    throw new Error('Invalid id field');
  }
  if (id !== getTokenData(jwtToken).id) {
    throw new Error('Unauthorized');
  }

  const index = 'email';

  const sheet = spreadsheet.getSheetByName(entity);
  if (sheet === null) {
    throw new Error(utils.properCase(entity) +' sheet not found');
  }
  const headers = utils.headers(sheet);
  const colIndex = headers.indexOf(index) + 1;
  if (colIndex === 0) {
    throw new Error('Invalid index column');
  }

  const dataRange = sheet.getDataRange().getValues();
  for (let i = 1; i < dataRange.length; i++) {
    if (i !== id && dataRange[i][colIndex - 1] === data[index]) {
      throw new Error('Record with the same ' + index + ' already exists');
    }
  }

  //skip the header row
  const row = id + 1;
  const cols = utils.colCount(sheet);
  const range = sheet.getRange(row, 1, 1, cols);
  var rowValues = range.getValues();
  var values = headers.map(header => data[header] || rowValues[0][headers.indexOf(header)]);
  range.setValues([values]);

  return transform(entity, data, id, headers);
}

function changePassword(entity, data) {
  var id = parseInt(data.id, 10);
  if (id === '' || id === undefined || !Number.isInteger(id)) {
    throw new Error('Invalid id field');
  }
  if (id !== getTokenData(jwtToken).id) {
    throw new Error('Unauthorized');
  }

  const sheet = spreadsheet.getSheetByName(entity);
  if (sheet === null) {
    throw new Error(utils.properCase(entity) +' sheet not found');
  }
  const headers = utils.headers(sheet);

  //skip the header row
  const row = id + 1;
  const cols = utils.colCount(sheet);
  const range = sheet.getRange(row, 1, 1, cols);
  var rowValues = range.getValues();
  var values = headers.map(header => {
    if (header === 'password') {
      return generatePasswordHash(data.newPassword);
    }
    return rowValues[0][headers.indexOf(header)]
  });
  range.setValues([values]);

  return transform(entity, data, id, headers);
}

function resetPassword(entity, data) {
  const defaultPassword = '1234';
  var id = parseInt(data.id, 10);
  if (id === '' || id === undefined || !Number.isInteger(id)) {
    throw new Error('Invalid id field');
  }
  if (!hasAccess(jwtToken, entity, 'update')) {
    throw new Error('Unauthorized');
  }

  const sheet = spreadsheet.getSheetByName(entity);
  if (sheet === null) {
    throw new Error(utils.properCase(entity) +' sheet not found');
  }
  const headers = utils.headers(sheet);

  //skip the header row
  const row = id + 1;
  const cols = utils.colCount(sheet);
  const range = sheet.getRange(row, 1, 1, cols);
  var rowValues = range.getValues();
  var values = headers.map(header => {
    if (header === 'password') {
      return generatePasswordHash(defaultPassword);
    }
    return rowValues[0][headers.indexOf(header)]
  });
  range.setValues([values]);

  return transform(entity, data, id, headers);
}

function readRow(entity, id) {
  id = parseInt(id, 10);
  if (id === '' || id === undefined || !Number.isInteger(id)) {
    throw new Error('Invalid id field');
  }
  //skip the header row
  var row = id + 1;
  const sheet = spreadsheet.getSheetByName(entity);
  if (sheet === null) {
    throw new Error(utils.properCase(entity) +' sheet not found');
  }
  const cols = utils.colCount(sheet);
  const headers = utils.headers(sheet);
  const data = sheet.getRange(row, 1, 1, cols).getValues();
  
  return transform(entity, data[0], id , headers);
}

function readRowProfile(entity, id) {
  id = getTokenData(jwtToken).id;
  if (id === '' || id === undefined || !Number.isInteger(id)) {
    throw new Error('Invalid id field');
  }
  //skip the header row
  var row = id + 1;
  const sheet = spreadsheet.getSheetByName(entity);
  if (sheet === null) {
    throw new Error(utils.properCase(entity) +' sheet not found');
  }
  const cols = utils.colCount(sheet);
  const headers = utils.headers(sheet);
  const data = sheet.getRange(row, 1, 1, cols).getDisplayValues();
  return transform(entity, data[0], id , headers);
}

function getFirstTimers(entity, data) {
  const sheet = spreadsheet.getSheetByName(entity);
  if (sheet === null) {
    throw new Error(utils.properCase(entity) +' sheet not found');
  }
  const headers = utils.headers(sheet);
  const dataRange = sheet.getDataRange().getValues();
  const date = new Date(data.date);

  const results = [];
  let matchFound = false;

  for (let rowIndex = dataRange.length - 1; rowIndex >= 0; rowIndex--) {
    const row = dataRange[rowIndex];
    const transformedRow = JSON.parse(transform(entity, row, rowIndex + 1, headers));
    const split = transformedRow.timestamp.split(' ');
    const joinedDate = split[0] + ' ' + split[1] + ' ' + split[2];
    const currentDate = Utilities.formatDate(date, "Asia/Manila", "MMMM d, yyyy");

    if (joinedDate === currentDate) {
      results.push(transformedRow);
      matchFound = true;
    } else if (matchFound) {
      break;
    }
  }

  return JSON.stringify(results);
}

function getBirthday(entity, data) {
  const sheet = spreadsheet.getSheetByName(entity);
  if (sheet === null) {
    throw new Error(utils.properCase(entity) +' sheet not found');
  }
  const headers = utils.headers(sheet);
  const dataRange = sheet.getDataRange().getValues();
  const date = new Date(data.date);
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - 3);
  const endDate = new Date(date);
  endDate.setDate(date.getDate() + 7);

  const results = dataRange.map((row, rowIndex) => {
    const transformedRow = JSON.parse(transform(entity, row, rowIndex + 1, headers));
    const bdayMonthDay = transformedRow.birthday.slice(0, transformedRow.birthday.length - 4);
    const birthday = new Date(bdayMonthDay + date.getFullYear());
    const bithhdayLastYear = new Date(bdayMonthDay + (date.getFullYear() - 1));
    const birthdayNextYear = new Date(bdayMonthDay + (date.getFullYear() + 1));
    if (startDate <= birthday && birthday <= endDate) {
      return transformedRow;
    }
    if (startDate <= bithhdayLastYear && bithhdayLastYear <= endDate) {
      return transformedRow;
    }
    if (startDate <= birthdayNextYear && birthdayNextYear <= endDate) {
      return transformedRow;
    }

    return null;
  }).filter(row => row !== null);

  return JSON.stringify(results);
}

function checkRow(entity, id) {
  id = parseInt(id, 10);
  if (id === '' || id === undefined || !Number.isInteger(id)) {
    throw new Error('Invalid id field');
  }
  //skip the header row
  var row = id + 1;
  const sheet = spreadsheet.getSheetByName(entity);
  if (sheet === null) {
    throw new Error(utils.properCase(entity) +' sheet not found');
  }
  const cols = utils.colCount(sheet);
  const data = sheet.getRange(row, 1, 1, cols).getValues();

  return data[0].some(value => value !== '');
}

function readAll(entity, filters = {}) {
  const sheet = spreadsheet.getSheetByName(entity);
  if (sheet === null) {
    throw new Error(utils.properCase(entity) +' sheet not found');
  }
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const results = data.map((row, rowIndex) => {
    return JSON.parse(transform(entity, row, rowIndex + 1, headers));
  });
  // Apply filters
  const filteredResults = results.filter(row => {
    return Object.keys(filters).every(key => {
      if (filters[key] === undefined || filters[key] === null) {
        return true;
      }
      if (key === 'id') {
        return row[key] == filters[key];
      }
      
      return row[key] && row[key].toString().toLowerCase().includes(filters[key].toString().toLowerCase());
    });
  });

  return JSON.stringify(filteredResults);
}

function getPassword(entity, username) {
  const sheet = spreadsheet.getSheetByName(entity);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  for (let i = data.length - 1; i >= 0; i--) {
    const row = data[i];
    if (row[headers.indexOf('username')] === username) {
      return row[headers.indexOf('password')];
    }
  }

  return null;
}

function readLast(entity, filters = {}) {
  const sheet = spreadsheet.getSheetByName(entity);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  for (let i = data.length - 1; i >= 0; i--) {
    const row = data[i];
    const transformedRow = JSON.parse(transform(entity, row, i + 1, headers));
    const isMatch = Object.keys(filters).every(key => {
      if (filters[key] === undefined || filters[key] === null) {
        return true;
      }
      if (key === 'id') {
        return transformedRow[key] == filters[key];
      }
      return transformedRow[key] && transformedRow[key].toString().toLowerCase().includes(filters[key].toString().toLowerCase());
    });
    if (isMatch) {
      return JSON.stringify(transformedRow);
    }
  }
  return null;
}

function countRows(entity, filters = {}) {
  const sheet = spreadsheet.getSheetByName(entity);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const results = data.map((row, rowIndex) => {
    return JSON.parse(transform(entity, row, rowIndex + 1, headers));
  });
  // Apply filters
  const filteredResults = results.filter(row => {
    return Object.keys(filters).every(key => {
      if (filters[key] === undefined || filters[key] === null) {
        return true;
      }
      if (key === 'id') {
        return row[key] == filters[key];
      }
      return row[key] && row[key].toString().toLowerCase().includes(filters[key].toString().toLowerCase());
    });
  });

  return filteredResults.length;
}