const { spawn } = require('child_process');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  // 1. Try to find active Wi-Fi / WLAN adapter first
  for (const name of Object.keys(interfaces)) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('wi-fi') || lowerName.includes('wlan') || lowerName.includes('wireless')) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }

  // 2. Try to find physical Ethernet adapter (excluding virtual ones)
  for (const name of Object.keys(interfaces)) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('ethernet')) {
      if (lowerName.includes('virtual') || lowerName.includes('vbox') || lowerName.includes('host-only') || lowerName.includes('vmnet')) {
        continue;
      }
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }

  // 3. Fallback to any active non-loopback IPv4 address
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return '0.0.0.0';
}

const localIP = getLocalIP();
console.log(`\n=================================================`);
console.log(`Dynamically resolved local IP address: ${localIP}`);
console.log(`Starting Next.js HTTPS Dev Server...`);
console.log(`=================================================\n`);

// Run next dev with dynamically resolved IP
const devProcess = spawn('npx', ['next', 'dev', '-H', localIP, '--experimental-https', '--webpack'], {
  stdio: 'inherit',
  shell: true
});

devProcess.on('exit', (code) => {
  process.exit(code || 0);
});
