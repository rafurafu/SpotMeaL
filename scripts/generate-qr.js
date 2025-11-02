#!/usr/bin/env node

/**
 * QRコード生成スクリプト（ターミナル用）
 *
 * 使い方:
 *   node scripts/generate-qr.js [予約ID]
 *   node scripts/generate-qr.js RES001
 *   node scripts/generate-qr.js           # デフォルト: TEST123
 */

const reservationId = process.argv[2] || 'TEST123';
const qrData = `spotmeal://reservation/${reservationId}`;

console.log('\n===========================================');
console.log('  SpotMeal QRコード生成');
console.log('===========================================\n');
console.log(`予約ID: ${reservationId}`);
console.log(`QRデータ: ${qrData}\n`);

// シンプルなQRコード風のASCIIアート表示
function generateSimpleQR(data) {
  const size = 25;
  const qr = [];

  // 簡易的なパターン生成（実際のQRコードではありませんが視覚的に表現）
  for (let i = 0; i < size; i++) {
    let row = '';
    for (let j = 0; j < size; j++) {
      // データに基づいた簡易的なパターン
      const hash = (i * j + data.length + i + j) % 2;
      row += hash ? '██' : '  ';
    }
    qr.push(row);
  }

  return qr;
}

const qrPattern = generateSimpleQR(qrData);

console.log('簡易QRコードパターン（イメージ）:');
console.log('┌' + '─'.repeat(50) + '┐');
qrPattern.forEach(row => console.log('│' + row + '│'));
console.log('└' + '─'.repeat(50) + '┘\n');

console.log('【重要】実際のQRコードを生成するには:');
console.log('\n1. オンラインQRコードジェネレーターを使用:');
console.log('   https://www.qr-code-generator.com/');
console.log(`   テキスト: ${qrData}`);

console.log('\n2. アプリ内のQRコード生成画面を使用:');
console.log('   - アプリを起動');
console.log('   - QRCodeGenerator画面に遷移');
console.log(`   - 予約ID「${reservationId}」を入力\n`);

console.log('3. 以下のコマンドでQRコード画像を生成:');
console.log(`   npm run qr:image ${reservationId}\n`);

console.log('===========================================\n');
