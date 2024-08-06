function main() {
  const queries = [
    'subject:"You have a new booking" is:unread',
    'subject:"Evaluation imminent" is:unread'
  ]; 

  const threads = [];
  queries.forEach(query => {
    threads.push(...GmailApp.search(query));
  });

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Bookings');
  const lastRow = sheet.getLastRow();

  let existingBodies = [];
  if (lastRow > 1) { 
    const data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    existingBodies = data.flat(); 
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
      const body = message.getPlainBody();

      if (!existingBodies.includes(body)) {
        // スプレッドシートに本文を書き込み
        sheet.appendRow([body]);

        const subject = message.getSubject();
        let payloadContent = '';

        if (subject.includes('Evaluation imminent')) {
          let userMatch = body.match(/You will review (.+?)'s code/);
          let userName = userMatch ? userMatch[1] : '';

          if (!userName) {
            userMatch = body.match(/Your code will be reviewed by (.+?) in 15 minutes/);
            userName = userMatch ? userMatch[1] : 'ユーザー';
            const userUrl = `https://profile.intra.42.fr/users/${userName}`;
            payloadContent = `@everyone [${userName}](${userUrl})が15分後にあなたのレビューを開始します！`;
          } else {
            const userUrl = `https://profile.intra.42.fr/users/${userName}`;
            payloadContent = `@everyone [${userName}](${userUrl})のレビューが15分後に始まります！`;
          }
        } else {
          const dateMatch = body.match(/from (.+) for/);
          const dateStr = dateMatch ? dateMatch[1] : null;
          let translatedDate = '';

          if (dateStr) {
            translatedDate = translateDateToJapanese(dateStr);
          }

          payloadContent = translatedDate ? 
            `@everyone 新しい予約があります: ${translatedDate}` : 
            `@everyone 新しい予約メールが届きました:\n件名: ${subject}\n本文: ${body}`;
        }

        // Discordに通知を送信
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
