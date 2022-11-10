import net from 'net';
import fs from 'fs';

const sock = net.connect({ port: 6003, host: '211.219.112.1' }, () => {
  console.log('Client connected');
  sock.write('1920&1080&126.3457&37.2222&10000&0\r\n');
});

let writeStream;
let lastBuf;
sock.on('data', function (data) {
  if (!writeStream) {
    // 처음이면!
    writeStream = fs.createWriteStream(
      new URL('manjoong_kim.png', import.meta.url)
    );

    // 처음 4바이트의 jpg 이미지 길이 데이터 제거위해 아무 처리없이 버린다!
    if (data.length > 4) lastBuf = data.subarray(4);
  } else {
    // 마지막 버퍼를 end event에서 처리하기 위해, 이전 데이터(버퍼)를 쓴다!
    if (lastBuf) writeStream.write(lastBuf);
    lastBuf = data; // 마지막 구분을 위해 현재값을 lastBuf로 남겨둔다.
  }

  sock.end();
});

sock.on('end', function () {
  // 마지막 버퍼의 8은 제외 (cpp 소스 126 line)
  writeStream.write(lastBuf.subarray(0, -8));
  writeStream.close();
  console.log('Client disconnected');
});
