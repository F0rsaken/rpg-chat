# RPGChat
## Goals
- p2p functionality
- server functionality (dedicated)?
- may work on irc server
- ability to add:
	- pictures
	- gifs
	- music, shown when needed or stopped
	- videos
	and being able to show them from chat (as in upload and use when appropriate)
	or like create room (let's say bar) and when someone enters, music starts playing

- possibility to create profiles, which would act as presets:
	they would contain text effects, possibilities:
		speed of text (final fantasy character by character printing)
		color
		font size, type
		color bleed
		text glitching
		tearing
		sound effects like chirping voice (different modes, sounds, again like ff), explosions, shakes, etc
	option to either save that as a character (dunno, for ex barman) or set them dynamically

- whisper: command to talk to player privately, would show to other present players as player1 whispers to player2

- special effects like window shake, bleed out of the window etc, whatever ill think of

- option to do /me or whatever its called like \*blushing furiously\*

- all of it should be kinda like scripting:  
    ex: \[\[tfx: type s: slow vfx: p1]]Jon: You shouldn't have called ME \[\[bg: dark_red]]  
    result: *Jon*: You shouldn't have called **ME**  
    all text types letter by letter slowly with voice effect p1, at the end the background changes
    
- gui option to highlight part of the text and select the effects you want on it, maybe with checkboxes 

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
