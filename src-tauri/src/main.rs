#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use chrono::Local;
use env_logger::Builder;
use lifelog::calendar_entry::__cmd__add_entry_for_date;
use lifelog::calendar_entry::__cmd__generate_from_file;
use lifelog::calendar_entry::__cmd__get_calendar_path;
use lifelog::calendar_entry::__cmd__get_entry_by_id;
use lifelog::calendar_entry::__cmd__remove_entry_by_ids;
use lifelog::calendar_entry::add_entry_for_date;
use lifelog::calendar_entry::generate_from_file;
use lifelog::calendar_entry::get_calendar_path;
use lifelog::calendar_entry::get_entry_by_id;
use lifelog::calendar_entry::remove_entry_by_ids;
use lifelog::statistics::__cmd__add_stats_for_date;
use lifelog::statistics::__cmd__calculate_work_hours;
use lifelog::statistics::__cmd__get_stats_for_date;
use lifelog::statistics::add_stats_for_date;
use lifelog::statistics::calculate_work_hours;
use lifelog::statistics::get_stats_for_date;
use log::LevelFilter;
use std::io::Write;
// use tauri::Menu;
// use tauri::Submenu;

#[tokio::main]
async fn main() {
    Builder::new()
        .format(|buf, record| {
            writeln!(
                buf,
                "{} [{}]-[{}] - {}",
                Local::now().format("%Y-%m-%dT%H:%M:%S"),
                record.module_path().unwrap(),
                record.level(),
                record.args()
            )
        })
        .filter(None, LevelFilter::Info)
        .init();
    // let mut calendar = Calendar {
    //     calendar_entries: Vec::new(),
    // };
    // let path = Path::new("./rozklad.ics");
    // calendar = calendar.from_icalendar(&path).await;
    // let path = Path::new("./rozklad.json");
    // calendar.save_to_json(&path).await;
    tauri::Builder::default()
        // .menu(Menu::new().add_submenu(Submenu::new("File", Menu::new())))
        .invoke_handler(tauri::generate_handler![
            generate_from_file,
            get_calendar_path,
            add_entry_for_date,
            remove_entry_by_ids,
            add_stats_for_date,
            get_stats_for_date,
            get_entry_by_id,
            calculate_work_hours,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
