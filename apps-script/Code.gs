/**
 * 마인드글로우 일기 시트 CRUD 웹 앱
 * 첫 번째 시트의 첫 행에서 timestamp, datetime, content 헤더를 찾습니다.
 */
const SPREADSHEET_ID = "1l8s7ahDh9xV2S0_b2VEwWd7KiCQ3k6T1TCGZzwwTVvI";
const REQUIRED_HEADERS = ["timestamp", "datetime", "content"];

/** GET ?action=list 또는 GET ?action=get&timestamp=... */
function doGet(event) {
  try {
    const params = (event && event.parameter) || {};
    const action = params.action || "list";

    if (action === "list") return jsonResponse({ success: true, data: listDiaries_() });
    if (action === "get") {
      const timestamp = requireTimestamp_(params.timestamp);
      const diary = findDiary_(timestamp);
      if (!diary) return jsonResponse({ success: false, error: "해당 일기를 찾을 수 없습니다." });
      return jsonResponse({ success: true, data: diary });
    }
    return jsonResponse({ success: false, error: "지원하지 않는 조회 작업입니다." });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "조회 중 오류가 발생했습니다." });
  }
}

/** POST JSON: { action: "create" | "update" | "delete", timestamp?, data? } */
function doPost(event) {
  try {
    const body = JSON.parse(event && event.postData && event.postData.contents || "{}");
    const action = body.action;

    if (action === "create") return jsonResponse({ success: true, data: createDiary_(body.data || {}) });
    if (action === "update") {
      const timestamp = requireTimestamp_(body.timestamp);
      return jsonResponse({ success: true, data: updateDiary_(timestamp, body.data || {}) });
    }
    if (action === "delete") {
      const timestamp = requireTimestamp_(body.timestamp);
      return jsonResponse({ success: true, data: deleteDiary_(timestamp) });
    }
    return jsonResponse({ success: false, error: "지원하지 않는 변경 작업입니다." });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "변경 중 오류가 발생했습니다." });
  }
}

/** 새 일기를 추가하고 timestamp를 반환합니다. */
function createDiary_(data) {
  const content = requireContent_(data.content);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const table = getDiaryTable_();
    const timestampColumn = table.columns.timestamp;
    const timestampValues = table.sheet.getLastRow() > 1
      ? table.sheet.getRange(2, timestampColumn, table.sheet.getLastRow() - 1, 1).getDisplayValues().flat()
      : [];
    let timestamp = Date.now();
    while (timestampValues.includes(String(timestamp))) timestamp += 1;

    const row = Array(table.lastColumn).fill("");
    row[timestampColumn - 1] = String(timestamp);
    row[table.columns.datetime - 1] = data.datetime ? String(data.datetime) : new Date().toISOString();
    row[table.columns.content - 1] = asPlainText_(content);
    const destination = table.sheet.getLastRow() + 1;
    table.sheet.getRange(destination, 1, 1, table.lastColumn).setNumberFormat("@");
    table.sheet.getRange(destination, 1, 1, table.lastColumn).setValues([row]);
    return { timestamp: String(timestamp), datetime: row[table.columns.datetime - 1], content };
  } finally {
    lock.releaseLock();
  }
}

/** 저장된 일기 목록을 최신순으로 반환합니다. */
function listDiaries_() {
  const table = getDiaryTable_();
  if (table.sheet.getLastRow() < 2) return [];
  const values = table.sheet.getRange(2, 1, table.sheet.getLastRow() - 1, table.lastColumn).getDisplayValues();
  return values.map((row) => rowToDiary_(row, table.columns))
    .filter((diary) => diary.timestamp)
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
}

/** timestamp가 일치하는 일기를 하나 반환합니다. */
function findDiary_(timestamp) {
  const table = getDiaryTable_();
  const rowNumber = findRowNumber_(table, timestamp);
  if (!rowNumber) return null;
  const values = table.sheet.getRange(rowNumber, 1, 1, table.lastColumn).getDisplayValues()[0];
  return rowToDiary_(values, table.columns);
}

/** datetime 또는 content를 수정합니다. timestamp는 식별자이므로 변경하지 않습니다. */
function updateDiary_(timestamp, data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const table = getDiaryTable_();
    const rowNumber = findRowNumber_(table, timestamp);
    if (!rowNumber) throw new Error("해당 일기를 찾을 수 없습니다.");
    if (data.datetime !== undefined) {
      table.sheet.getRange(rowNumber, table.columns.datetime).setNumberFormat("@");
      table.sheet.getRange(rowNumber, table.columns.datetime).setValue(String(data.datetime));
    }
    if (data.content !== undefined) {
      table.sheet.getRange(rowNumber, table.columns.content).setNumberFormat("@");
      table.sheet.getRange(rowNumber, table.columns.content).setValue(asPlainText_(requireContent_(data.content)));
    }
    return findDiary_(timestamp);
  } finally {
    lock.releaseLock();
  }
}

/** timestamp가 일치하는 일기 행을 삭제합니다. */
function deleteDiary_(timestamp) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const table = getDiaryTable_();
    const rowNumber = findRowNumber_(table, timestamp);
    if (!rowNumber) throw new Error("해당 일기를 찾을 수 없습니다.");
    table.sheet.deleteRow(rowNumber);
    return { timestamp, deleted: true };
  } finally {
    lock.releaseLock();
  }
}

/** 시트와 헤더 위치를 찾아 열 순서 변경에도 대응합니다. */
function getDiaryTable_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheets()[0];
  if (!sheet) throw new Error("스프레드시트에 시트가 없습니다.");
  const lastColumn = sheet.getLastColumn();
  if (!lastColumn) throw new Error("첫 번째 행에 timestamp, datetime, content 헤더를 추가해 주세요.");

  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0]
    .map((header) => String(header).trim().toLowerCase());
  const columns = {};
  REQUIRED_HEADERS.forEach((name) => {
    const index = headers.indexOf(name);
    if (index === -1) throw new Error(`필수 헤더 '${name}'를 첫 번째 행에서 찾을 수 없습니다.`);
    columns[name] = index + 1;
  });
  return { sheet, lastColumn, columns };
}

function findRowNumber_(table, timestamp) {
  const lastRow = table.sheet.getLastRow();
  if (lastRow < 2) return null;
  const values = table.sheet.getRange(2, table.columns.timestamp, lastRow - 1, 1).getDisplayValues();
  const index = values.findIndex((row) => String(row[0]) === timestamp);
  return index === -1 ? null : index + 2;
}

function rowToDiary_(row, columns) {
  return {
    timestamp: String(row[columns.timestamp - 1] || ""),
    datetime: String(row[columns.datetime - 1] || ""),
    content: String(row[columns.content - 1] || ""),
  };
}

function requireTimestamp_(value) {
  const timestamp = String(value || "").trim();
  if (!timestamp) throw new Error("timestamp 값이 필요합니다.");
  return timestamp;
}

function requireContent_(value) {
  const content = String(value || "").trim();
  if (!content) throw new Error("content 값이 필요합니다.");
  return content;
}

/** 사용자가 입력한 문자열이 시트 수식으로 해석되지 않도록 보호합니다. */
function asPlainText_(value) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
