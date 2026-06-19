// Vercel Serverless Function: /api/status
module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    message: 'AuthorBox API 정상 작동 중',
    timestamp: new Date().toISOString(),
    env: {
      hasSheetId: !!process.env.GOOGLE_SHEET_ID,
      hasEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasKey: !!process.env.GOOGLE_PRIVATE_KEY,
    },
  });
};
