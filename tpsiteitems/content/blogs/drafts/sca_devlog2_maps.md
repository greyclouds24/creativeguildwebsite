---
title: Devlog #2 - Reworking the Map
datePublished: 2026-10-29
category: Space Combat Arena - Devlog
tags: ["Space Combat Arena", "devlog", "map", "game analysis", "2d game design", "Godot"]
excerpt: "The game's map is in desperate need of reworking."
readTime: 4 min read
---

!pic{"assets/images/blog/SCA - fullscreen title menu.png"}#space-combat-arena#title

# The Current Map Design is Bad

It's not just bad in the context of the visuals. Most of what's there right now is just filler content anyway. My real concern is regarding the gameplay design.

The current map design is heavily insired by an old game called Bosconian. 

!pic{"assets/images/blog/devlog_assets/bosconian_screenshot.png"}["Source: https://store.playstation.com/en-us/product/UP0571-CUSA44187_00-HAMPRDC000000001"]#bosconian_game_screenshots#inspiration

It's designed so that when your ship reaches the edge of the screen, your ship snaps to the opposite end of the map. 

It's trying to replicate a 3D space onto a 2D platform by creating this sort of wrap around plane. 

I want to keep the essence of that inspiration in order to maintain that retro/modern feel, but the way it's currently implemented is problematic.

## Isolating the Problems

   1. Camera Teleportation is Jarring 
      

   2. Shrinks Actual Playable Area
      

   3. Neutralizes Long Range Weapons
      
   
   4. Too Frequent Teleportation
      Between frequent boosting and fast paced combat, the teleportation becomes near constant anytime you're anywhere other than the center of the map.

## How Traveling in 2D Works (technical limitations)

!pic{"assets/images/blog/devlog_assets/square_map_design.png"}["Godot square map screenshot"]#map



## The Black Hole Solution

This whole scenario is a really interesting insight into how game design has changed over time. Old games, like the one this is inspired by, would typically be played on more square shaped screens.

Older home TVs and classic arcade consoles were much more square shaped and so designing a square map makes sense in order to give players an seamless gameplay experience.

And this is where I think the problem lies. Modern gaming is done almost entirely on very rectangular screens. More often then not, the problems occur on the left and right side of the map.

I'm assuming this can be attributed to the left and right providing the largest visible areas. Meaning combat and movement is more likely to occur left and right.

So if the old map was trying to emulate a sphere in a 2d space, I'm going to try emulating a ring in a 2d space.

!pic{"assets/images/blog/devlog_assets/map_change_plans.png"}["Godot map change plans"]#map#gamedesign

The goal will be to push either end of the map out from the center. Vertical wrap around will remain in place, but with horizontal wrap around being much further apart we should be able to get a bigger feel during navigation.

But now that the space is much bigger it feels as though the teleportation needs a reason for existing.

# Final Thoughts

Summary of thoughts and stuff that will be in the caption section of a post. or maybe update on how all of the above progressed. like we were able to do that. yay.
Restatement of thesis. Closing arguements. Etc. Etc. - turn into caption

Social Call to Action - turn into second to last slide
Update/Announcement/Where to Buy Call to Action - turn into slide