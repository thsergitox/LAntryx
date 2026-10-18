const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
function check(directory) {
 for (const entry of fs.readdirSync(directory,{withFileTypes:true})) {
  const file=path.join(directory,entry.name);
  if (entry.isDirectory()) check(file);
  else if (/\.(cjs|mjs)$/.test(file)) execFileSync(process.execPath,['--check',file]);
 }
}
check('src'); check('scripts'); console.log('PASS Node module syntax');
