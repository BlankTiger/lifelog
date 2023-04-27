default:
	@just --list

push:
	#!/bin/zsh
	cd ~/.config/lifelog
	pwd
	git add .
	git commit -m "$(date)"
	git push

run:
	npm run tauri dev
