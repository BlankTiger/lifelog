default:
	@just --list

push:
	#!/bin/zsh
	cd ~/.config/lifelog
	git add .
	git commit -m "$(date)"
	git push
	cd -
