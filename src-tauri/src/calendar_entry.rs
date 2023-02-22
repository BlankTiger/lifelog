use crate::backup::backup;
use crate::calendar::CalendarEntry;
use crate::command_result::CommandResult;
use eyre::eyre;
use std::path::Path;
use std::{collections::HashMap, path::PathBuf};
use tokio::{fs, io::AsyncWriteExt};

type CalendarEntries = HashMap<String, Vec<CalendarEntry>>;

pub async fn get_entries_from_file(path: &Path) -> CommandResult<String> {
    Ok(fs::read_to_string(path).await?)
}

pub fn entries_from_json(entries: &str) -> CommandResult<CalendarEntries> {
    Ok(serde_json::from_str(entries)?)
}

#[tauri::command]
pub async fn generate_from_file(path: &Path) -> CommandResult<CalendarEntries> {
    let entries = get_entries_from_file(path);
    entries_from_json(&entries.await?)
}

#[tauri::command]
pub fn get_calendar_path() -> CommandResult<String> {
    Ok(home::home_dir()
        .ok_or(eyre!("Can't get home dir"))?
        .display()
        .to_string()
        + "/.config/lifelog/calendar.json")
}

fn get_calendar_path_buf() -> CommandResult<PathBuf> {
    let calendar_path_str = get_calendar_path()?;
    Ok(PathBuf::from(&calendar_path_str))
}

#[tauri::command]
pub async fn add_entry_for_date(
    date: String,
    entry: CalendarEntry,
) -> CommandResult<CalendarEntries> {
    backup(None).await?;
    let calendar_path = get_calendar_path_buf()?;
    let mut entries = generate_from_file(&calendar_path).await?;
    entries.entry(date).or_insert_with(Vec::new).push(entry);
    entries = entries
        .into_iter()
        .map(|(day, mut day_entries)| {
            day_entries.sort_by(|a, b| a.start.cmp(&b.start));
            (day, day_entries)
        })
        .collect::<CalendarEntries>();
    save_to_file(&calendar_path, &entries).await?;
    Ok(entries)
}

#[tauri::command]
pub async fn remove_entry_by_ids(ids: Vec<i64>) -> CommandResult<CalendarEntries> {
    backup(None).await?;
    let calendar_path = get_calendar_path_buf()?;
    let mut entries = generate_from_file(&calendar_path).await?;
    entries = entries
        .into_iter()
        .map(|(day, mut day_entries)| {
            day_entries.retain(|entry| !ids.contains(&entry.id));
            (day, day_entries)
        })
        .collect::<CalendarEntries>();
    save_to_file(&calendar_path, &entries).await?;
    Ok(entries)
}

#[tauri::command]
pub async fn get_entry_by_id(id: i64) -> CommandResult<CalendarEntry> {
    let calendar_path = get_calendar_path_buf()?;
    let entries = generate_from_file(&calendar_path).await?;
    let mut found_entry = None;
    entries.into_iter().for_each(|(_, mut day_entries)| {
        day_entries.retain(|entry| entry.id == id);
        if day_entries.len() == 1 {
            found_entry = Some(day_entries[0].clone());
        }
    });
    Ok(found_entry.ok_or(eyre!("Entry not found for id: {}", id))?)
}

#[tauri::command]
pub async fn save_to_file(path: &Path, entries: &CalendarEntries) -> CommandResult<()> {
    backup(None).await?;
    let mut file = fs::File::create(path).await?;
    let json_string = serde_json::to_string_pretty(&entries)?;
    file.write_all(json_string.as_bytes()).await?;
    Ok(())
}
