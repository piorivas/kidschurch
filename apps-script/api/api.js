var spreadsheet = null;
var cache = [];
var jwtToken = '';

function apiFetch(entity, method, body = {}, token = null)
{
  jwtToken = token;
  spreadsheet = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty('database')
  );

  if ('GET' == method){
    return readRow(entity, body.id || {});
  } else if ('SEARCH' == method){
    validateAccess(entity, 'view');
    return search(entity, body);
  } else if ('GETALL' == method){
    return readAll(entity, body || {});
  } else if ('UPDATE' == method) {
    validateAccess(entity, 'update');
    return updateRow(entity, body);
  } else if ('UPDATEALL' == method) {
    validateAccess(entity, 'update');
    return updateRows(entity, body.filters, body.updates);
  } else if ('UPDATEUNIQUE' == method) {
    return updateUniqueRow(entity, body, body.index);
  } else if ('CREATE' == method) {
    validateAccess(entity, 'create');
    return createRow(entity, body);
  } else if ('DELETEREQEST' == method) {
    return createRow(entity, body);
  } else if ('GETLAST' == method) {
    return readLast(entity, body);
  } else if ('GETCOUNT' == method) {
    return countRows(entity, body);
  } else if ('CHECKEXIST' == method) {
    return checkRow(entity, body.id || {});
  } else if ('CREATEUNIQUE' == method ) {
    validateAccess(entity, 'create');
    return createUniqueRow(entity, body, body.index);
  } else if ('GETPROFILE' == method ) {
    return readRowProfile(entity);
  } else if ('UPDATEPROFILE' == method ) {
    validateAccess(entity, 'update');
    return updateRowProfile(entity, body);
  } else if ('CHANGEPASSWORD' == method ) {
    return changePassword(entity, body);
  } else if ('RESETPASSWORD' == method ) {
    return resetPassword(entity, body);
  } else if ('GETBDAY' == method ) {
    validateAccess(entity, 'view');
    return getBirthday(entity, body);
  } else if ('GETFIRSTTIMERS' == method ) {
    validateAccess(entity, 'view');
    return getFirstTimers(entity, body);
  } else if ('KIDSIGNUP' == method) {
    return createRow(entity, body);
  } else if ('DELETE' == method) {
    validateAccess(entity, 'delete');
    return deleteRow(entity, body.id || {});
  }
  else {
    console.error("Invalid method. ");
  }

  return null;
}

function validateAccess(entity, method){
  if (!hasAccess(jwtToken, entity, method)) {
    throw new Error('Unauthorized access to ' + entity + ' ' + method);
  }
}