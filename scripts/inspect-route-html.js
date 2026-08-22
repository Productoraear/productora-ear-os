const { spawn } = require('child_process');

async function inspect() {
  const serverProcess = spawn('npm', ['run', 'start', '--', '-p', '3002'], {
    shell: true,
    stdio: 'pipe'
  });

  await new Promise(resolve => setTimeout(resolve, 6000));

  try {
    const res = await fetch('http://localhost:3002/servicios/chofer-vip');
    const text = await res.text();
    console.log('Status:', res.status);
    const allH1 = text.match(/<h1[\s\S]*?<\/h1>/gi);
    console.log('All H1 tags found:', allH1);
  } catch (e) {
    console.error(e);
  }

  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']);
  } else {
    serverProcess.kill();
  }
}

inspect();
