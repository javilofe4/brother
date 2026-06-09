# Instalación para Windows

## Requisitos mínimos
- Node.js LTS
- npm
- Rust / rustup
- Cargo
- Microsoft Visual Studio 2022 Build Tools
- Desktop development with C++
- Windows 10/11 SDK
- WebView2 Runtime
- Git

## Opcionales recomendados
- GitHub CLI
- Visual Studio Code
- Extensiones: Tauri, rust-analyzer, ESLint, Prettier

## Instalación con winget
```powershell
winget install OpenJS.NodeJS.LTS
winget install Rustlang.Rustup
winget install Microsoft.VisualStudio.2022.BuildTools
winget install Git.Git
winget install Microsoft.EdgeWebView2Runtime
winget install GitHub.cli
```

## Verificar el entorno
```powershell
node --version
npm --version
rustc --version
cargo --version
git --version
```

## Notas
- Si falta `rustc` / `cargo`, instala `rustup` y ejecuta `rustup toolchain install stable`.
- Si falta la SDK de Windows, instálala desde Visual Studio Installer con "Desktop development with C++".
- Si `WebView2` no está presente, instala Microsoft Edge WebView2 Runtime.
