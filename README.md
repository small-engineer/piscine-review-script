# review依頼メールを受け取ってDiscordに通知を飛ばす

## 必要なもの

- Googleアカウント
- Discordアカウント
- Googleスプレッドシート
- Discord Webhook URL

## Discord Webhookの設定手順

### 1. Discordサーバーの作成

1. Discordアプリを開きます。
2. 左側のサーバーリストの一番下にある `+` ボタンをクリックします。
3. `Create a Server` を選択し、適当にいい感じのサーバー名を入力して `Create` ボタンをクリックします。

### 2. Webhookの作成

1. サーバー設定を開くために、サーバー名の横にある下矢印をクリックし、`Server Settings` を選択します。
2. 左側のメニューから `Integrations` を選択し、`Webhooks` をクリックします。
3. `New Webhook` ボタンをクリックし、Webhookの名前を設定します。
4. `Copy Webhook URL` ボタンをクリックして、Webhook URLをコピーします。
5. このURLを後でGoogle Apps Scriptのスクリプトプロパティに追加します。

## スクリプトの設定手順

### 1. Googleスプレッドシートの準備

1. [Googleスプレッドシート](https://docs.google.com/spreadsheets/)を作成します。
2. シートの名前を `Bookings` に変更します。

### 2. Google Apps Scriptの設定

1. Googleスプレッドシートのメニューから `拡張機能` > `Apps Script` をクリックします。
2. 新しいプロジェクトが開くので、スクリプトエディタに、code,gsの内容を貼り付けます。

### 3. Webhook URLの設定

1. `ファイル` > `プロジェクトのプロパティ` をクリックします。
2. `スクリプトのプロパティ` タブを選択し、`DISCORD_WEBHOOK_URL` という名前でDiscordのWebhook URLを追加します。

### 4. トリガーの設定

1. スクリプトエディタの左側メニューから `時計` アイコン（トリガー）をクリックします。
2. `トリガーを追加` をクリックし、適切な関数を定期的に実行するように設定します（例: 5分ごと）。

### 5. スクリプトの実行権限を設定

1. スクリプトエディタで必要な関数を選択し、`実行` ボタンをクリックします。
2. 必要な権限を付与するために指示に従います。
