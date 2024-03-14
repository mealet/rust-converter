#[tauri::command]
pub fn console_log(msg: &str) -> String {
    println!("{}", msg);
    return "Ok".to_string();
}