/**
 * Google Sheets API Client
 * Provides client-side REST interaction with Google Sheets and Google Drive APIs
 * using the OAuth access token obtained via Firebase Auth.
 */

export interface GoogleSpreadsheetItem {
  id: string;
  name: string;
  modifiedTime: string;
  webViewLink?: string;
}

export interface SpreadsheetDetails {
  spreadsheetId: string;
  title: string;
  sheets: {
    sheetId: number;
    title: string;
    rowCount: number;
    columnCount: number;
  }[];
}

/**
 * Creates a brand new Google Spreadsheet populated with OCR table headers and rows.
 */
export async function createSpreadsheet(
  accessToken: string,
  title: string,
  headers: string[],
  rows: (string | number)[][]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string; title: string }> {
  const allValues = [headers, ...rows];

  const requestBody = {
    properties: {
      title: title || 'Photo to Text - OCR Export',
    },
    sheets: [
      {
        properties: {
          title: 'Extracted OCR Data',
          gridProperties: {
            frozenRowCount: 1,
            rowCount: Math.max(allValues.length + 10, 50),
            columnCount: Math.max(headers.length + 2, 10),
          },
        },
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: allValues.map((row, rowIdx) => ({
              values: row.map((cell) => ({
                userEnteredValue: {
                  stringValue: String(cell ?? ''),
                },
                userEnteredFormat: rowIdx === 0 ? {
                  backgroundColor: { red: 0.05, green: 0.58, blue: 0.95, alpha: 1 },
                  textFormat: {
                    foregroundColor: { red: 1, green: 1, blue: 1, alpha: 1 },
                    bold: true,
                    fontSize: 10,
                  },
                } : undefined,
              })),
            })),
          },
        ],
      },
    ],
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to create spreadsheet (${response.status})`);
  }

  const result = await response.json();
  const spreadsheetId = result.spreadsheetId;
  const spreadsheetUrl = result.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

  return {
    spreadsheetId,
    spreadsheetUrl,
    title: result.properties?.title || title,
  };
}

/**
 * Lists the user's Google Sheets from Google Drive.
 */
export async function listUserSpreadsheets(accessToken: string): Promise<GoogleSpreadsheetItem[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const fields = encodeURIComponent('files(id,name,modifiedTime,webViewLink)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime%20desc&pageSize=25`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to fetch spreadsheets (${response.status})`);
  }

  const data = await response.json();
  return (data.files || []).map((f: any) => ({
    id: f.id,
    name: f.name,
    modifiedTime: f.modifiedTime,
    webViewLink: f.webViewLink || `https://docs.google.com/spreadsheets/d/${f.id}`,
  }));
}

/**
 * Fetches details and sheets list for a given spreadsheet.
 */
export async function getSpreadsheetDetails(
  accessToken: string,
  spreadsheetId: string
): Promise<SpreadsheetDetails> {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=spreadsheetId,properties.title,sheets.properties`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to fetch spreadsheet details (${response.status})`);
  }

  const data = await response.json();
  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || 'Untitled Spreadsheet',
    sheets: (data.sheets || []).map((s: any) => ({
      sheetId: s.properties?.sheetId || 0,
      title: s.properties?.title || 'Sheet1',
      rowCount: s.properties?.gridProperties?.rowCount || 100,
      columnCount: s.properties?.gridProperties?.columnCount || 26,
    })),
  };
}

/**
 * Appends rows to an existing Google Spreadsheet.
 */
export async function appendRowsToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  rows: (string | number)[][]
): Promise<{ updatedRows: number; updatedRange: string }> {
  const range = `${encodeURIComponent(sheetName)}!A1`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: rows,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to append rows (${response.status})`);
  }

  const result = await response.json();
  return {
    updatedRows: result.updates?.updatedRows || rows.length,
    updatedRange: result.updates?.updatedRange || sheetName,
  };
}

/**
 * Reads values from a spreadsheet range.
 */
export async function readSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string
): Promise<{ values: string[][] }> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to read spreadsheet (${response.status})`);
  }

  const data = await response.json();
  return {
    values: data.values || [],
  };
}
