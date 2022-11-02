use crate::command_result::CommandResult;
use chrono::{DateTime, Local, NaiveDate};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, fs};

#[derive(Serialize, Deserialize, Debug)]
pub struct PauseTime {
    elapsed_time: i64,
    actual_time: i64,
    current_time: DateTime<Local>,
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
pub fn generate_from_file() -> CommandResult<HashMap<NaiveDate, Vec<Entry>>> {
    let file = fs::read_to_string("./entries.json").expect("Read a file");
    let entries: HashMap<NaiveDate, Vec<Entry>> =
        serde_json::from_str(&file).expect("Converted to json");
    Ok(entries)
}
