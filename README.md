# Lifelog

Project aiming to help in the process of logging your activities throughout the
day. Stores data in json files under `~/.config/lifelog` directory. Keeps track
of 20 past backups of the used log files (`~/.config/lifelog/calendar.json`,
`~/.config/lifelog/statistics.json`). Every backup is created after a change to
any of the log files.

Currently it logs how much actual time you spend on each activity from calendar
and how much you were supposed to spend. This is accomplished using your
honesty, because you are supposed to click `pause` every time you get distracted
from the task at hand and click `resume` whenever you get back to performing the
activity.


## Features

- [x] Log activities from calendar
- [x] Log time spent on each activity
- [x] Get back to current day after clicking on date in calendar view
- [x] Save statistics at any time
- [x] Add calendar entry from the app
- [x] Remove calendar entry from the app
- [ ] Change calendar entry from the app
- [ ] Different calendar views (right now only 'daily' view is available)
- [ ] Better way to import calendar events

## Screenshot

![Lifelog](https://user-images.githubusercontent.com/16402420/209021298-489a8994-2fcd-45dd-a6de-e87a34c6083b.png)


# Installation

Currently only linux is supported because unix paths are hardcoded into the app
code. At some point I will make it work on windows as well.


## Linux, macOS should actually work in the same way

1. Install [Rust](https://www.rust-lang.org/tools/install).
2. Make sure to follow instructions from [tauri docs](https://tauri.app/v1/guides/getting-started/prerequisites).
3. Clone this repository and `cd` into it.
4. Run `npm install` to install dependencies.
5. Run `npm run tauri dev` to build and run the app.

## Windows

Not here yet.
