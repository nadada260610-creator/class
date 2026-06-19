// Vercel Serverless Function: /api/save-to-sheet
// Express 서버를 Vercel Function 형식으로 변환

const { google } = require('googleapis');

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'AuthorBox데이터';

// ─── CORS 헤더 설정 ──────────────────────────────────────────────────────────
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ─── 구글 인증 ───────────────────────────────────────────────────────────────
function getGoogleAuth() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : null;

  if (!privateKey || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    throw new Error('구글 서비스 계정 환경 변수가 설정되지 않았습니다.');
  }

  return new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

// ─── 시트 헤더 초기화 ────────────────────────────────────────────────────────
async function ensureSheetHeaders(sheets) {
  const headers = [
    '저장 시각', '프로젝트 ID', '프로젝트 제목', '노드 타입',
    '노드 ID', '씬 번호', '씬 제목', '씬 요약', '씬 내용', '부모 경로',
  ];

  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const sheetExists = spreadsheet.data.sheets.some(
    (s) => s.properties.title === SHEET_NAME
  );

  if (!sheetExists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: { requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] },
    });
  }

  const headerCheck = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:A1`,
  });

  if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [headers] },
    });
  }
}

// ─── 트리 노드 평탄화 ────────────────────────────────────────────────────────
function flattenNodes(nodes, parentPath = '', projectId, projectTitle, timestamp) {
  const rows = [];
  for (const node of nodes) {
    const currentPath = parentPath
      ? `${parentPath} > ${node.title || node.id}`
      : (node.title || node.id);

    if (node.type === 'scene') {
      rows.push([
        timestamp, projectId, projectTitle, node.type, node.id,
        node.scene_number || '', node.title || `씬 ${node.scene_number}`,
        node.summary || '', node.content || '', parentPath || '(루트)',
      ]);
    }
    if (node.children && node.children.length > 0) {
      rows.push(...flattenNodes(node.children, currentPath, projectId, projectTitle, timestamp));
    }
  }
  return rows;
}

// ─── 핸들러 ─────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { project } = req.body;
  if (!project) {
    return res.status(400).json({ error: 'project 데이터가 필요합니다.' });
  }
  if (!SHEET_ID) {
    return res.status(500).json({ error: 'GOOGLE_SHEET_ID 환경 변수가 설정되지 않았습니다.' });
  }

  try {
    const auth = getGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    await ensureSheetHeaders(sheets);

    // 기존 데이터 삭제 (헤더 1행 유지)
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A2:J`,
    });
    if (existing.data.values && existing.data.values.length > 0) {
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A2:J`,
      });
    }

    const timestamp = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    const rows = flattenNodes(project.nodes || [], '', project.project_id, project.title, timestamp);

    if (rows.length === 0) {
      return res.status(200).json({ success: true, rowsSaved: 0, message: '저장할 씬이 없습니다.' });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A2`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: rows },
    });

    return res.status(200).json({ success: true, rowsSaved: rows.length, timestamp });

  } catch (err) {
    console.error('구글 시트 저장 오류:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
