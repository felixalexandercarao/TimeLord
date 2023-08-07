# TimeLord - A simple mobile game event countdown timer

[![CC BY-SA 4.0][cc-by-sa-shield]][cc-by-sa]

This work is licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License][cc-by-sa].

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png
[cc-by-sa-shield]: https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg

TimeLord is a simple web-based mobile game event countdown timer. (Emphasis on the word "simple" -- I
literally knocked this out in like 2 hours.)

## But why?

So, yeah, I love mobile games. And I am insane enough to be playing several of them. And there's always a ton of
events whose dates I want to keep track of -- when an event starts and ends, when a gacha banner starts and ends,
etc. And, as if that weren't hard enough, they tend to use different timezones -- some use UTC, some use Japan
Standard Time, some use UTC+8 (those are the Chinese ones), etc. And my puny brain can't keep track of all of this
and do all the timezone conversions. Surely there must be a better way? (and don't call me Shirley...)

Well yeah there is. We're living in THE FUTURE (zura) after all. There are many great countdown apps for mobile
devices. But there are several problems with these. First, many of them don't support different timezones. And,
even worse, they don't sync data across multiple devices. (At least none that I could find did.) And I typically
play on one of several different devices -- phone, tablet and/or computer -- depending on the situation. Having to
maintain the same list of event timers on each different device was getting to be a royal pain.

So I was bored one night and though to myself "shouldn't there be a web app for this?" Well surprisingly there
wasn't. (At least none that I could find.) And so I decided, right on the spot, to make one. (Yeah, I'm kinda
impulsive like that...)

## How do I use this?

You'll need to add information on the games you play, and the events you want to track, into the `events.json`
file. This file is in [JSON format](https://en.wikipedia.org/wiki/JSON) and should be fairly self-explanatory.
Just copypasta the example info I have in there and change it to your liking.

Note that when specifying timezones, you will need to specify by their [TZ identifier](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List). You can usually find out a game's
timezone by browsing through their in-game news/announcements, or ask around in the game's subreddit (or if all
else fails, good old [/r/gachagaming](https://www.reddit.com/r/gachagaming/).)

Once you've added/updated the event info you want to track, you'll need to get this code up onto the Web somehow.
If you have a web server, just stick the files in a directory and Bob's your uncle. If you don't have a Web server,
then you can "cheat" using GitHub Pages -- they will host it for free, with
[some restrictions](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#limits-on-use-of-github-pages) that shouldn't affect you.
Just clone this repository on Github (set up a free Github account if you don't already have one) and enable
Github Pages ([instructions can be found here](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)).
Your event counter should now be accessible at `https://yourusername.github.io/TimeLord/`.

## TODO's

- Needs to look nicer
  - Group games under their own header (with one of those disclosure triangles that let you show/hide an entire section)
- Handle data refreshing better (automatically check for updates periodically, don't make the user reload the browser)
- Ability to create and edit events within the web app
  - this is probably a distant goal, as it would probably require some sort of server back-end
- Add info on when day reset is for each game
- make the code less hacky in general
