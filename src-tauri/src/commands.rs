use std::process::Command;

#[tauri::command]
pub fn console_log(msg: &str) -> String {
    println!("{}", msg);
    return "Ok".to_string();
}

#[tauri::command]
pub fn convertFile(filePath: &str, formatTarget: &str, outputDir: &str, formatName: &str, inputFormat: &str) -> Result<String, String> {
    let outputConvert = format!("{}/{}converted.{}", outputDir, &formatName, formatTarget);

    let photo_formats = ["png", "jpg", "jpeg", "gif", "bmp", "tiff", "webp", "svg", "ico"];
    let video_formats = ["mp4", "mov", "avi", "wmv", "mkv", "flv", "mpg", "mpeg", "mpe", "m4v", "m2v"];
    let audio_formats = ["mp3", "m4a", "wav", "flac", "aac", "oga", "aif", "aiff", "wma", "wv", "ogg", "m4b", "pcm"];

    // resolving crashes when converting image to video/audio and etc...
    if photo_formats.contains(&inputFormat) && (video_formats.contains(&formatTarget) || audio_formats.contains(&formatTarget)) {
        return Err("You cannot convert photo to video/audio!".into());
    } else if video_formats.contains(&inputFormat) && (photo_formats.contains(&formatTarget) || audio_formats.contains(&formatTarget)) {
        return Err("You cannot convert video to photo/audio!".into());
    } else if audio_formats.contains(&inputFormat) && (photo_formats.contains(&formatTarget) || video_formats.contains(&formatTarget)) {
        return Err("You cannot convert audio to photo/video!".into());
    }

    // checking if format target is photo
    if photo_formats.contains(&formatTarget) {
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

    return Ok("Ok".to_string());
}

// ffmpeg -i input.mp4 -c:v libx264 -c:a pcm_s16le output.avi