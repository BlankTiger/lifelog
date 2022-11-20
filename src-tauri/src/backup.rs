use crate::command_result::FsResult;
use tokio::fs::{copy, create_dir, read_dir, remove_dir_all, rename};

pub async fn backup(oldest: Option<i32>) -> FsResult<()> {
    remove_old_backup(oldest).await?;
    push_backup_numbers().await?;
    create_backup().await?;
    Ok(())
}

async fn push_backup_numbers() -> FsResult<()> {
    let mut backup_numbers = get_backup_numbers().await?;
    backup_numbers.reverse();

    for number in backup_numbers.into_iter() {
        let mut backup_path = get_path_for_backup();
        backup_path.push_str("backup_");

        let mut old_backup_path = backup_path.clone();
        old_backup_path.push_str(&number.to_string());
        let mut new_backup_path = backup_path.clone();
        new_backup_path.push_str(&(number + 1).to_string());

        rename(&old_backup_path, &new_backup_path).await?;
        log::info!("Renamed {}, to {}", old_backup_path, new_backup_path);
    }

    Ok(())
}

async fn create_backup() -> FsResult<()> {
    let mut backup_path = get_path_for_backup();
    backup_path.push_str("backup_1/");
    create_dir(&backup_path).await?;
    log::info!("Created dir at {}", &backup_path);
    let files_for_backup = get_file_paths();
    for file in files_for_backup.into_iter() {
        let file_path_parts = &file.split('/').collect::<Vec<&str>>();
        let file_name = file_path_parts[file_path_parts.len() - 1];
        let mut new_file_path = backup_path.clone();
        new_file_path.push_str(file_name);
        copy(&file, &new_file_path).await?;
        log::info!("Copied file from {}, to {}", &file, &new_file_path);
    }

    Ok(())
}

fn get_file_paths() -> Vec<String> {
    vec![
        "/home/blanktiger/.config/lifelog/statistics.json".to_string(),
        "/home/blanktiger/.config/lifelog/calendar.json".to_string(),
    ]
}

fn get_path_for_backup() -> String {
    "/home/blanktiger/.config/lifelog/backup/".to_string()
}

async fn get_backup_numbers() -> FsResult<Vec<i32>> {
    let backup_path = get_path_for_backup();
    let mut directories = read_dir(backup_path).await?;

    let mut backup_numbers = Vec::<i32>::new();

    while let Some(entry) = directories.next_entry().await? {
        if entry.path().is_dir() {
            let folder_name = entry.file_name();
            let split = folder_name
                .to_str()
                .unwrap()
                .split('_')
                .collect::<Vec<&str>>();
            if split[0] == "backup" {
                let number = split[1].parse::<i32>().unwrap_or(0);
                backup_numbers.push(number);
            }
        }
    }

    backup_numbers.sort();
    Ok(backup_numbers)
}

async fn remove_old_backup(number: Option<i32>) -> FsResult<()> {
    let remove_older_than = number.unwrap_or(20);
    let backup_numbers = get_backup_numbers().await?;
    let backups_path = get_path_for_backup();
    let backups_to_remove = &backup_numbers
        .into_iter()
        .filter(|number| number >= &remove_older_than)
        .map(|number| {
            let mut to_remove = backups_path.clone();
            to_remove.push_str("backup_");
            to_remove.push_str(&number.to_string());
            to_remove
        })
        .collect::<Vec<String>>();

    for to_remove in backups_to_remove {
        log::info!("Removing {}", to_remove);
        remove_dir_all(to_remove).await?;
    }
    Ok(())
}
