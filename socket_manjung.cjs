const net = require('net');
const fs = require('fs');
const path = require('path');

const sock = getConnection('com');
writeData(sock, '1920&1080&126.3457&37.2222&10000&0');

function getConnection(connName) {
  let writeStream;
  Buffer.alloc(1024);
  const bufs = [];
  const client = net.connect(
    { port: 6003, host: '211.219.112.1' },
    function () {
      console.log(connName + ' Connected: ');
      console.log('   local = %s:%s', this.localAddress, this.localPort);
      console.log('   remote = %s:%s', this.remoteAddress, this.remotePort);
      this.setTimeout(5000);
      // this.setEncoding('utf8');
      this.on('data', function (data) {
        // console.log(connName + ' From Server: ' + data.toString());
        // const tmp = Buffer.from(data, 'base64');
        console.log(':::>>', data);
        // if (!writeStream) writeStream = fs.createWriteStream(wfile);
        // writeStream.write(data);
        // writeStream.write(tmp);
        // fs.writeFileSync('./sock.jpeg', data);
        const wfile = path.join(__dirname, 'sock.jpeg');
        if (!writeStream) writeStream = fs.createWriteStream(wfile);
        writeStream.write(data);
        // this.end();
        // bufs.push(data);
      });
      this.on('end', function () {
        console.log(connName + ' Client disconnected');
        // const wfile = path.join(__dirname, 'sock.jpeg');
        // if (!writeStream) writeStream = fs.createWriteStream(wfile);
        // writeStream.write(Buffer.concat(bufs));
        writeStream.close();
      });
      this.on('error', function (err) {
        console.log('Socket Error: ', JSON.stringify(err));
      });
      this.on('timeout', function () {
        console.log('Socket Timed Out');
        this.end();
      });
      this.on('close', function () {
        console.log('Socket Closed');
      });
    }
  );
  return client;
}

function writeData(socket, data) {
  var success = !socket.write(data);
  if (!success) {
    (function (socket, data) {
      socket.once('drain', function () {
        writeData(socket, data);
      });
    })(socket, data);
  }
}
