#!/usr/bin/env node

/**
 * QRコード画像生成スクリプト
 *
 * 使い方:
 *   npm install qrcode
 *   node scripts/generate-qr-image.js [予約ID]
 */

const reservationId = process.argv[2] || 'TEST123';
const qrData = `spotmeal://reservation/${reservationId}`;

console.log('\n===========================================');
console.log('  SpotMeal QRコード画像生成');
console.log('===========================================\n');

try {
  const QRCode = require('qrcode');
  const fs = require('fs');
  const path = require('path');

  const outputDir = path.join(__dirname, '../qr-codes');
  const outputPath = path.join(outputDir, `reservation-${reservationId}.png`);

  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // QRコードを生成
  QRCode.toFile(
    outputPath,
    qrData,
    {
      width: 500,
      margin: 2,
      color: {
        dark: '#FF6B6B',  // SpotMealのプライマリカラー
        light: '#FFFFFF'
      }
    },
    (err) => {
      if (err) {
        console.error('❌ QRコード生成エラー:', err.message);
        process.exit(1);
      }

      console.log(`✅ QRコード画像を生成しました！`);
      console.log(`📁 保存先: ${outputPath}`);
      console.log(`\n予約ID: ${reservationId}`);
      console.log(`QRデータ: ${qrData}\n`);
      console.log('===========================================\n');
    }
  );

  // ターミナル表示用
  QRCode.toString(qrData, { type: 'terminal' }, (err, string) => {
    if (!err) {
      console.log('\nターミナル表示:');
      console.log(string);
    }
  });

} catch (error) {
  console.error('\n⚠️  qrcodeパッケージがインストールされていません。');
  console.log('\n以下のコマンドでインストールしてください:');
  console.log('  npm install qrcode\n');
  console.log('その後、再度実行してください:');
  console.log(`  node scripts/generate-qr-image.js ${reservationId}\n`);
  console.log('===========================================\n');
  process.exit(1);
}
