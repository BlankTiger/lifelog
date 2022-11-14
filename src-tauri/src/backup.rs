use std::{
    collections::HashMap,
    path::{Path, PathBuf},
};
use tokio::{fs, io::AsyncWriteExt};

use crate::command_result::CommandResult;

#[tauri::command]
pub async fn create_backup() -> CommandResult<()>{
    let backup_path = get_path_for_backup().await;
    Ok(())
}

async fn get_path_for_backup() -> PathBuf {

}


