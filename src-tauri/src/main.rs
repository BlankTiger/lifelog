#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use lifelog::calendar::Calendar;
use lifelog::calendar_entry::__cmd__generate_from_file;
use lifelog::calendar_entry::generate_from_file;
use std::collections::HashMap;
use std::path::Path;

#[tokio::main]
async fn main() {
    // let mut calendar = Calendar {
    //     calendar_entries: Vec::new(),
    // };
    // let path = Path::new("./rozklad.ics");
    // calendar = calendar.from_icalendar(&path).await;
    // let path = Path::new("./rozklad.json");
    // calendar.save_to_json(&path).await;
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![generate_from_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
