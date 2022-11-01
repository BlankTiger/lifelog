use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};
use crate::command_result::CommandResult;
use std::fs;

#[derive(Serialize, Deserialize, Debug)]
pub struct Entry {
    title: String,
    desc: String,
    start_time: DateTime<Local>,
    end_time: DateTime<Local>,
}

#[tauri::command]
pub fn generate_from_file() -> CommandResult<Vec<Entry>> {
    let file = fs::read_to_string("./entries.json").expect("New");
    let entries: Vec<Entry> = serde_json::from_str(&file).expect("wow");
    Ok(entries)
}
