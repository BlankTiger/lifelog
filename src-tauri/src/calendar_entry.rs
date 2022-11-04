use crate::calendar::CalendarEntry;
use crate::command_result::CommandResult;
use std::collections::HashMap;
use std::path::Path;
use tokio::{fs, io::AsyncWriteExt};

type CalendarEntries = HashMap<String, Vec<CalendarEntry>>;

pub async fn get_entries_from_file(path: &Path) -> CommandResult<String> {
    Ok(fs::read_to_string(path).await.expect("Can read file"))
}

pub fn entries_to_json(entries: &str) -> CalendarEntries {
    serde_json::from_str(entries).expect("Converted to json")
}

#[tauri::command]
pub async fn generate_from_file(path: &Path) -> CommandResult<CalendarEntries> {
    let entries = get_entries_from_file(path);
    Ok(entries_to_json(&entries.await?))
}

#[tauri::command]
pub async fn add_entry_for_date(
    path: &Path,
    date: String,
    entry: CalendarEntry,
) -> CommandResult<CalendarEntries> {
    let mut entries = generate_from_file(path).await?;
    entries
        .entry(date)
        .or_insert_with(Vec::new)
        .push(entry.clone());
    Ok(entries)
}

#[tauri::command]
pub async fn save_to_file(path: &Path, entries: CalendarEntries) {
    let mut file = fs::File::create(path).await.expect("Should create file");
    let json = serde_json::to_string(&entries).unwrap();
    file.write_all(json.as_bytes())
        .await
        .expect("Should write to file");
}
