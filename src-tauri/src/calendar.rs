use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, path::Path};
use tokio::{fs, io::AsyncWriteExt};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum EntryStatus {
    Confirmed,
    Rejected,
    Unknown,
    Waiting,
    Accepted,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum EntryType {
    Work,
    University,
    Personal,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CalendarEntry {
    pub id: i64,
    pub start: DateTime<Utc>,
    pub end: DateTime<Utc>,
    pub summary: String,
    pub description: String,
    pub location: String,
    pub status: EntryStatus,
    pub entry_type: EntryType,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Calendar {
    pub calendar_entries: Vec<CalendarEntry>,
}

impl Calendar {
    pub async fn from_icalendar(mut self, path: &Path) -> Self {
        let file = fs::read_to_string(path).await.expect("Should read file");
        let lines = file.split("\r\n").collect::<Vec<&str>>();
        // let timezone = lines[6];
        let mut begin_indexes = Vec::new();
        let mut end_indexes = Vec::new();
        for (i, line) in lines.iter().enumerate() {
            if line.contains("BEGIN:VEVENT") {
                begin_indexes.push(i);
            } else if line.contains("END:VEVENT") {
                end_indexes.push(i);
            }
        }

        for i in 0..begin_indexes.len() {
            let first = begin_indexes[i];
            let start = &lines[first + 1];
            let start = format!(
                "{}-{}-{}T{}:{}:{}.000+00:00",
                &start[8..12],
                &start[12..14],
                &start[14..16],
                &start[17..19],
                &start[19..21],
                &start[21..23]
            );
            let end = &lines[first + 2];
            let end = format!(
                "{}-{}-{}T{}:{}:{}.000+00:00",
                &end[6..10],
                &end[10..12],
                &end[12..14],
                &end[15..17],
                &end[17..19],
                &end[19..21]
            );

            let start_date = DateTime::parse_from_rfc3339(&start).unwrap();
            let end_date = DateTime::parse_from_rfc3339(&end).unwrap();
            let status = match &lines[first + 10][7..] {
                "CONFIRMED" => EntryStatus::Confirmed,
                _ => EntryStatus::Confirmed,
            };

            let start = DateTime::<Utc>::from(start_date);
            let end = DateTime::<Utc>::from(end_date);

            let calendar_entry = CalendarEntry {
                start,
                end,
                id: lines[first + 4][4..].parse::<i64>().unwrap(),
                description: lines[first + 6][12..].into(),
                location: lines[first + 8][9..].to_owned().replace('\\', ""),
                status,
                summary: lines[first + 11][8..].into(),
                entry_type: EntryType::University,
            };
            self.calendar_entries.push(calendar_entry);
        }
        self
    }
    // pub fn from_json(&mut self, path: &Path) {}
    // pub fn save_to_icalendar(&self, path: &Path) {}
    pub async fn save_to_json(&self, path: &Path) {
        let mut calendar_entries: HashMap<String, Vec<CalendarEntry>> = HashMap::new();
        for entry in &self.calendar_entries {
            let day = format!(
                "{}.{}.{}",
                &entry.start.to_string()[8..10],
                &entry.start.to_string()[5..7],
                &entry.start.to_string()[..4],
            );
            calendar_entries
                .entry(day)
                .or_insert_with(Vec::new)
                .push(entry.clone());
        }
        let json = serde_json::to_string(&calendar_entries).unwrap();
        let mut file = fs::File::create(path).await.expect("Should create file");
        file.write_all(json.as_bytes())
            .await
            .expect("Should write to file");
    }
    // pub fn to_icalendar(&self) {}
    // pub fn to_json(&self) {}
}
