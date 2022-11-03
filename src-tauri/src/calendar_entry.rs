use crate::command_result::CommandResult;
use crate::calendar::CalendarEntry;
use std::collections::HashMap;
use tokio::fs;

#[tauri::command]
pub async fn generate_from_file() -> CommandResult<HashMap<String, Vec<CalendarEntry>>> {
    let file = fs::read_to_string("./rozklad.json")
        .await
        .expect("Can read file");
    let entries: HashMap<String, Vec<CalendarEntry>> =
        serde_json::from_str(&file).expect("Converted to json");
    Ok(entries)
}
