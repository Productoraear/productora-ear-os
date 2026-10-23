const { execSync } = require('child_process');

function run(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', shell: 'powershell.exe', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    } catch (e) {
        return 'ERROR: ' + ((e && e.message) || e);
    }
}

console.log('=== GPU / VRAM ===');
const gpu = run('Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM, DriverVersion, VideoProcessor | Format-List');
console.log(gpu);

console.log('\n=== AMD SMI (VRAM real usada/total) ===');
console.log(run('amd-smi metric --mem 2>&1'));
console.log(run('amd-smi static --asic 2>&1'));

console.log('\n=== OLLAMA PS (modelos residentes en VRAM) ===');
console.log(run('ollama ps'));

console.log('\n=== OLLAMA SHOW qwen3.5-35b-a3b (contexto/config) ===');
console.log(run('ollama show qwen3.5-35b-a3b --modelfile 2>&1 | Select-String -Pattern "num_ctx|num_gpu|PARAMETER" '));

console.log('\n=== MEMORIA DEL SISTEMA (RAM) ===');
console.log(run('Get-CimInstance Win32_ComputerSystem | Select-Object @{N=\"TotalRAM_GB\";E={[math]::Round($_.TotalPhysicalMemory/1GB,1)}} | Format-List'));
console.log(run('Get-CimInstance Win32_OperatingSystem | Select-Object @{N=\"FreeRAM_GB\";E={[math]::Round($_.FreePhysicalMemory/1MB,1)}} | Format-List'));