use crate::command_result::CommandResult;
use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tokio::fs;

#[derive(Serialize, Deserialize, Debug)]
pub struct PauseTime {
    elapsed_time: i64,
    actual_time: i64,
    current_time: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Entry {
    id: i64,
    title: String,
    desc: String,
    start: DateTime<Local>,
    end: DateTime<Local>,
    pause_times: Vec<PauseTime>,
}

#[tauri::command]
pub async fn generate_from_file() -> CommandResult<HashMap<String, Vec<Entry>>> {
    let file = fs::read_to_string("./entries.json")
        .await
        .expect("Can read file");
    let entries: HashMap<String, Vec<Entry>> =
        serde_json::from_str(&file).expect("Converted to json");
    Ok(entries)
}
