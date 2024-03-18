use std::process::Command;

#[tauri::command]
pub fn console_log(msg: &str) -> String {
    println!("{}", msg);
    return "Ok".to_string();
}

// v.1.0.0 
// Converting with converter_buddy
//
// #[tauri::command]
// pub fn convertFile(filePath: &str, formatTarget: &str) -> Result<String, String> {
//     let inputFile = ConvertibleFile::new(filePath);
//     let inputFormat = inputFile.format().expect("No format found");

//     let outputFormat = match formatTarget {
//         "png" => Format::Png,
//         "jpg" => Format::Jpeg,
//         "bmp" => Format::Bmp,
//         "tiff" => Format::Tiff,
//         "gif" => Format::Gif,
//         _ => Format::Png
//     };

//     let ConvResult = match inputFile.convert(outputFormat) {
//         Ok(_) => Ok("Convert successfully!".into()),
//         Err(e) => {
//             println!("Error: {:?}", e);
//             return Err("Convert failed!".into());
//         }
//     };

//     return ConvResult;
// }

#[tauri::command]
pub fn convertFile(filePath: &str, formatTarget: &str, outputDir: &str, formatName: &str, iterIndex: i32) -> String {
    let outputConvert = format!("{}/{}converted.{}", outputDir, &formatName, formatTarget);

    if ["png", "jpg", "bmp", "tiff", "gif", "webp"].contains(&formatTarget) {
        let mut convertCommand = Command::new("ffmpeg")
        .arg("-i")
        .arg(filePath)
        .arg(outputConvert)
        .output()
        .expect("Failed to convert");
    } else {
        let mut convertCommand = Command::new("ffmpeg")
        .arg("-i")
        .arg(filePath)
        .arg("-c:v")
        .arg("libx264")
        .arg("-c:a")
        .arg("pcm_s16le")
        .arg(outputConvert)
        .output()
        .expect("Failed to convert");
    }

    return iterIndex.to_string();
}

// ffmpeg -i input.mp4 -c:v libx264 -c:a pcm_s16le output.avi