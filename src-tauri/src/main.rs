#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use lifelog::calendar_entry::__cmd__generate_from_file;
use lifelog::calendar_entry::generate_from_file;

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![generate_from_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
