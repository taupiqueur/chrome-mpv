# General options
name = chrome-mpv
version = $(shell git describe --tags --always)

all: assets/mpv-logo@16px.png assets/mpv-logo@32px.png assets/mpv-logo@48px.png assets/mpv-logo@128px.png

assets/mpv-logo.svg:
	curl -sSL -z $@ --create-dirs -o $@ https://github.com/mpv-player/mpv/raw/master/etc/mpv.svg

assets/mpv-logo@16px.png: assets/mpv-logo.svg
	inkscape $< -o $@ -w 16 -h 16

assets/mpv-logo@32px.png: assets/mpv-logo.svg
	inkscape $< -o $@ -w 32 -h 32

assets/mpv-logo@48px.png: assets/mpv-logo.svg
	inkscape $< -o $@ -w 48 -h 48

assets/mpv-logo@128px.png: assets/mpv-logo.svg
	inkscape $< -o $@ -w 128 -h 128

build: all
	npm install

release: clean build
	7z a releases/$(name)-$(version).zip manifest.json src assets ./@types

clean:
	git clean -d -f -X
