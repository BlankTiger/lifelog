use serde::{ser::Serializer, Serialize};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum CommandError {
    #[error(transparent)]
    ColorEyreError(#[from] color_eyre::Report),
    #[error(transparent)]
    FsError(#[from] FsError),
    #[error(transparent)]
    IOError(#[from] std::io::Error),
    #[error("App error: {0}")]
    AppError(String),
    #[error(transparent)]
    JsonError(#[from] serde_json::Error),
}

#[derive(Debug, Error)]
pub enum FsError {
    #[error(transparent)]
    IOError(#[from] std::io::Error),
}

impl Serialize for CommandError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

impl Serialize for FsError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub type CommandResult<T, E = CommandError> = color_eyre::Result<T, E>;
pub type FsResult<T, E = FsError> = color_eyre::Result<T, E>;
