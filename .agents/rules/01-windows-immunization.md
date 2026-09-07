---
description: "EAR OS V2 Windows & Environment Immunization Rules"
---

# Windows Immunization (01-windows-immunization.md)

1. **Mandatory Environment**: PowerShell 7 Native on Windows 10/11 (`H:\EAR_OS_V2\EAR_OS_V2`).
2. **Path Resolution**: Always use Windows-compliant absolute paths or proper `path.join` avoiding hardcoded forward slashes when interacting with the bare-metal OS.
3. **Encoding & BOM**: Ensure all generated files, especially JSON and Markdown, use UTF-8 encoding without BOM.
4. **Symlinks & Admin Rights**: Avoid creating symbolic links that require elevation unless strictly necessary and documented.
5. **Port Binding**: Ensure development servers bind to `127.0.0.1` explicitly rather than `localhost` to bypass IPv6 resolution delays on certain Windows configurations.
