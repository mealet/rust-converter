use converter_buddy::{format::Format, io::ConvertibleFile};



#[tauri::command]
pub fn console_log(msg: &str) -> String {
    println!("{}", msg);
    return "Ok".to_string();
}

#[tauri::command]
pub fn convertFile(filePath: &str, formatTarget: &str) -> Result<String, String> {
    let inputFile = ConvertibleFile::new(filePath);
    let inputFormat = inputFile.format().expect("No format found");

    let outputFormat = match formatTarget {
        "png" => Format::Png,
        "jpg" => Format::Jpeg,
        "webp" => Format::WebP,
        "bmp" => Format::Bmp,
        _ => Format::Png
    };

    let ConvResult = match inputFile.convert(outputFormat) {
        Ok(_) => Ok("Convert successfully!".into()),
        Err(err) => Err("Convert failed!".into())
    };

    return ConvResult;
}