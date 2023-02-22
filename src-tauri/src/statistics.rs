use crate::{calendar::EntryType, command_result::CommandResult, backup::backup};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    path::{Path, PathBuf},
};
use tokio::{fs, io::AsyncWriteExt};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Stats {
    id: i64,
    total_duration: f64,
    total_actual_duration: f64,
    efficiency: f64,
    resume_times: Vec<DateTime<Utc>>,
    pause_times: Vec<DateTime<Utc>>,
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
pub async fn add_stats_for_date(date: String, stats: Stats) -> CommandResult<Statistics> {
    backup(None).await?;
    let stats_path = get_stats_path_buf().unwrap();
    let mut statistics = generate_stats_from_file(&stats_path).await?;
    statistics.entry(date).or_insert_with(Vec::new).push(stats);
    save_stats_to_file(&stats_path, &statistics).await?;
    Ok(statistics)
}

#[tauri::command]
pub async fn get_stats_for_date(date: String) -> CommandResult<Vec<Stats>> {
    let stats_path = get_stats_path_buf().unwrap();
    let statistics = generate_stats_from_file(&stats_path).await?;
    Ok(match statistics.get(&date) {
        Some(stats) => stats.clone(),
        None => Vec::new(),
    })
}

#[tauri::command]
pub async fn calculate_work_hours() -> CommandResult<(f64, f64)> {
    let stats_path = get_stats_path_buf().unwrap();
    let statistics = generate_stats_from_file(&stats_path).await?;
    let today = chrono::Utc::now()
        .to_string()
        .split('-')
        .map(|v| v.to_string())
        .collect::<Vec<String>>();

    let month = &today[1];
    let year = &today[0];
    let calendar_days = (1..31)
        .map(|day_number| {
            let mut day = day_number.to_string();
            if day_number < 10 {
                day = "0".to_string() + &day;
            }
            format!("{}.{}.{}", day, month, year)
        })
        .collect::<Vec<String>>();

    let mut total_hours: f64 = 0.0;
    let mut total_actual_hours: f64 = 0.0;
    for day in calendar_days.into_iter() {
        if let Some(stats) = statistics.get(&day) {
            for stat in stats.iter() {
                if let EntryType::Work = crate::calendar_entry::get_entry_by_id(stat.id)
                    .await?
                    .entry_type
                {
                    total_hours += stat.total_duration / 3600.0;
                    total_actual_hours += stat.total_actual_duration / 3600.0;
                }
            }
        }
    }
    Ok((total_actual_hours, total_hours))
}

pub fn get_stats_path() -> CommandResult<String> {
    Ok(home::home_dir().unwrap().display().to_string() + "/.config/lifelog/statistics.json")
}

fn get_stats_path_buf() -> Option<PathBuf> {
    let calendar_path_str = get_stats_path().expect("Can get calendar path");
    Some(PathBuf::from(&calendar_path_str))
}

#[tauri::command]
pub async fn save_stats_to_file(path: &Path, stats: &Statistics) -> CommandResult<()> {
    backup(None).await?;
    let mut file = fs::File::create(path).await.expect("Should create file");
    let json_string = serde_json::to_string_pretty(&stats).expect("Can convert to string");
    file.write_all(json_string.as_bytes())
        .await
        .expect("Should write to file");
    Ok(())
}
