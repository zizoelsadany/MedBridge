const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 Table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createZip(sourceDir, zipFilePath, excludeList) {
  const files = [];

  function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (excludeList.includes(item)) continue;
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        const relPath = path.relative(sourceDir, fullPath).replace(/\\/g, '/');
        files.push({ fullPath, relPath });
      }
    }
  }

  walk(sourceDir);

  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const file of files) {
    const content = fs.readFileSync(file.fullPath);
    const crc = crc32(content);
    const compressed = zlib.deflateRawSync(content);
    const fileNameBuf = Buffer.from(file.relPath, 'utf8');

    // Local file header
    const lfh = Buffer.alloc(30 + fileNameBuf.length);
    lfh.writeUInt32LE(0x04034b50, 0);
    lfh.writeUInt16LE(20, 4);
    lfh.writeUInt16LE(0, 6);
    lfh.writeUInt16LE(8, 8);
    lfh.writeUInt16LE(0, 10);
    lfh.writeUInt16LE(0, 12);
    lfh.writeUInt32LE(crc, 14);
    lfh.writeUInt32LE(compressed.length, 18);
    lfh.writeUInt32LE(content.length, 22);
    lfh.writeUInt16LE(fileNameBuf.length, 26);
    lfh.writeUInt16LE(0, 28);
    fileNameBuf.copy(lfh, 30);

    localHeaders.push(lfh, compressed);

    // Central directory header
    const cdh = Buffer.alloc(46 + fileNameBuf.length);
    cdh.writeUInt32LE(0x02014b50, 0);
    cdh.writeUInt16LE(20, 4);
    cdh.writeUInt16LE(20, 6);
    cdh.writeUInt16LE(0, 8);
    cdh.writeUInt16LE(8, 10);
    cdh.writeUInt16LE(0, 12);
    cdh.writeUInt16LE(0, 14);
    cdh.writeUInt32LE(crc, 16);
    cdh.writeUInt32LE(compressed.length, 20);
    cdh.writeUInt32LE(content.length, 24);
    cdh.writeUInt16LE(fileNameBuf.length, 28);
    cdh.writeUInt16LE(0, 30);
    cdh.writeUInt16LE(0, 32);
    cdh.writeUInt16LE(0, 34);
    cdh.writeUInt16LE(0, 36);
    cdh.writeUInt32LE(0, 38);
    cdh.writeUInt32LE(offset, 42);
    fileNameBuf.copy(cdh, 46);

    centralHeaders.push(cdh);

    offset += lfh.length + compressed.length;
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const cdh of centralHeaders) {
    centralDirSize += cdh.length;
  }

  // End of Central Directory Record
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirOffset, 16);
  eocd.writeUInt16LE(0, 20);

  const finalBuf = Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
  fs.writeFileSync(zipFilePath, finalBuf);
  console.log(`Med_Bridge_Plus.zip created successfully: ${zipFilePath}`);
}

const source = __dirname;
const zipPath = path.join(__dirname, 'Med_Bridge_Plus.zip');
const excludes = ['.git', 'node_modules', '.next', 'Med_Bridge_Plus.zip'];

createZip(source, zipPath, excludes);
