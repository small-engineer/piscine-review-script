function main() {
  const query = 'subject:"You have a new booking" is:unread'; 
  // 件名に"you have a new booking"が含まれるメールを検索
  const threads = GmailApp.search(query);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Bookings');
  const lastRow = sheet.getLastRow();

  let existingIds = [];
  if (lastRow > 1) { 
    const data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    existingIds = data.flat(); 
  }

  const webhookUrl = PropertiesService.getScriptProperties().getProperty('DISCORD_WEBHOOK_URL'); 
  // 環境変数にWebhookURLを入れる

  if (!webhookUrl) {
    Logger.log('Webhook URLが設定されていません。スクリプトプロパティで設定してください。');
    return;
  }

  threads.forEach(thread => {
    const messages = thread.getMessages();
    messages.forEach(message => {
      const messageId = message.getId();

      if (!existingIds.includes(messageId)) {
        // スプレッドシート書き込みあり
        sheet.appendRow([messageId]);

        const body = message.getPlainBody();
        
        const dateMatch = body.match(/from (.+) for/);
        const dateStr = dateMatch ? dateMatch[1] : null;
        let translatedDate = '';

        if (dateStr) {
          translatedDate = translateDateToJapanese(dateStr);
        }

        // Discordに通知を送信
        const payloadContent = translatedDate ? 
          `@everyone 新しい予約があります: ${translatedDate}` : 
          `@everyone 新しい予約メールが届きました:\n件名: ${message.getSubject()}\n本文: ${body}`;

        const payload = {
          content: payloadContent
        };

        const options = {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify(payload)
        };

        UrlFetchApp.fetch(webhookUrl, options);
      }
    });
  });
}

function translateDateToJapanese(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) return null;

  const year = date.getFullYear();
  const month = date.getMonth() + 1; 
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = ('0' + date.getMinutes()).slice(-2);

  return `${year}年${month}月${day}日 ${hours}時${minutes}分`;
}
