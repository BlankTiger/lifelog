#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use lifelog::calendar_entry::__cmd__add_entry_for_date;
use lifelog::calendar_entry::__cmd__generate_from_file;
use lifelog::calendar_entry::__cmd__get_calendar_path;
use lifelog::calendar_entry::__cmd__remove_entry_by_id;
use lifelog::calendar_entry::add_entry_for_date;
use lifelog::calendar_entry::generate_from_file;
use lifelog::calendar_entry::get_calendar_path;
use lifelog::calendar_entry::remove_entry_by_id;

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
        .invoke_handler(tauri::generate_handler![
            generate_from_file,
            get_calendar_path,
            add_entry_for_date,
            remove_entry_by_id
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
