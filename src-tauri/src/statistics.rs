use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tokio::{fs, io::AsyncWriteExt};
use crate::command_result::CommandResult;
use std::{collections::HashMap, path::{PathBuf, Path}};


#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Stats {
    id: i64,
    total_duration: i64,
    total_actual_duration: i64,
    efficiency: f64,
    resume_times: Vec<DateTime<Utc>>,
    pause_times: Vec<DateTime<Utc>>
}

type Statistics = HashMap<String, Vec<Stats>>;

pub async fn get_stats_from_file(path: &Path) -> CommandResult<String> {
    Ok(fs::read_to_string(path).await.expect("Can read file"))
}

pub fn stats_from_json(statistics: &str) -> CommandResult<Statistics> {
    Ok(serde_json::from_str(statistics).expect("Converted to json"))
}

#[tauri::command]
pub async fn generate_stats_from_file(path: &Path) -> CommandResult<Statistics> {
    let stats = get_stats_from_file(path);
    stats_from_json(&stats.await?)
}

#[tauri::command]
pub async fn add_stats_for_date(
    date: String,
    stats: Stats,
) -> CommandResult<Statistics> {
    let stats_path = get_stats_path_buf().unwrap();
    let mut statistics = generate_stats_from_file(&stats_path).await?;
    statistics
        .entry(date)
        .or_insert_with(Vec::new)
        .push(stats);
    save_stats_to_file(&stats_path, &statistics).await?;
    Ok(statistics)
}

#[tauri::command]
pub fn get_stats_path() -> CommandResult<String> {
    Ok(home::home_dir().unwrap().display().to_string() + "/.config/lifelog/statistics.json")
}

fn get_stats_path_buf() -> Option<PathBuf> {
    let calendar_path_str = get_stats_path().expect("Can get calendar path");
    Some(PathBuf::from(&calendar_path_str))
}

#[tauri::command]
pub async fn save_stats_to_file(path: &Path, stats: &Statistics) -> CommandResult<()> {
    let mut file = fs::File::create(path).await.expect("Should create file");
    let json_string = serde_json::to_string(&stats).expect("Can convert to string");
    file.write_all(json_string.as_bytes())
        .await
        .expect("Should write to file");
    Ok(())
}