![rust-converter](https://github.com/mealet/rust-converter/assets/110933288/5d9b7711-6dd1-4c63-b611-0f5ed9fce054)

# 🦀 Rust Converter
![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmealet%2Frust-converter%2Fmain%2Fpackage.json&query=%24.version&style=for-the-badge&label=version&color=%23ff0d0d)
![Static Badge](https://img.shields.io/badge/rust-red?style=for-the-badge&label=Language&color=%23ff0d0d)
![Static Badge](https://img.shields.io/badge/MIT-red?style=for-the-badge&label=License&color=%23ff0d0d)



Tauri Converter - is pretty simple GUI converter made on Rust ✨<br>
Libraries I used:
- [Tauri](https://tauri.app/) | **GUI FRAMEWORK**
- [Bootstrap](https://getbootstrap.com/) | **GUI STYLES**
- [Vanilla JS](https://tauri.app/v1/guides/getting-started/setup/html-css-js/) | **GUI FUNCTIONS**
- [FFmpeg](https://ffmpeg.org/) | **FILES CONVERT**

## 👀 Installation
1. Install **fmpeg** from official site -> https://ffmpeg.org/download.html
2. Go to repository's releases
3. Download latest release for your system
4. Enjoy :D

## 🧐 Building
1. Install Tauri by instructions on [official site](https://tauri.app/).
2. Install **fmpeg** from official site -> https://ffmpeg.org/download.html
3. Copy repository and go to it's folder.
4. Install dependencies:
```
npm install
```
4. Go to the `src-tauri` directory and add _converter-buddy_:
```
cargo add converter_buddy
```
6. Build/Run Dev from main-repo folder:
```
npm run tauri build
```
**OR**
```
npm run tauri dev
```

File will be located in the `rust-converter/src-tauri/target/release` folder.

## 😵‍💫 License
Project licensed under the MIT License.<br>
Read more in [LICENSE file](/LICENSE)
<br>

## 🔗 Links
 - Tauri - https://tauri.app/
 - Rust - https://www.rust-lang.org/
 - Bootstrap - https://getbootstrap.com/
 - FFmpeg - https://ffmpeg.org/
