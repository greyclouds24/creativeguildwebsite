---
title: SCA Devlog 2 - Map Changes
datePublished: 2026-10-29
category: Devlog
tags: ["Space Combat Arena", "devlog", "map", "gameplay design", "CollisionShape2D", "Godot"]
excerpt: "The game's map is in desperate need of reworking."
readTime: 4 min read
---

!pic{"assets/images/blog/SCA - fullscreen title menu.png"}#space-combat-arena#title

# The Current Map Design is Bad

It's not just bad in the context of the visuals. Most of what's there right now is just filler content anyway. My real concern is regarding the gameplay design.

The current map design is heavily insired by an old game called Bosconian. It's designed so that when your ship reaches the edge of the screen, your ship snaps to the opposite end of the map. 

I want to keep the essence of that inspiration in order to maintain that retro/modern feel, but the way it's currently implemented is problematic.

## Isolating the Problems



## How Traveling in 2D Works (technical limitations)

!pic{"assets/images/blog/devlog_assets/square_map_design.png"}["Godot square map screenshot"]#map

Ships are bright, colorful 2D sci-fi, drawn in a higher-resolution pixel-art style from a loose top-down view. Pixel art is the default on purpose. It is a nod to the arcade games this is stealing from. Other art styles can show up later as optional downloads. Only the ships, and maybe a few map features, need to live in that pixel style.

The battlefield itself stays bright so the fight reads clearly. Color and glow have to share the screen with the ships and the effects, so the foreground cannot turn into visual noise.

Behind that, we want a darker, more vivid backdrop: planets, stars, and other cosmic objects sitting far away, ideally in 3D. The working description is a glorious celestial battlefield you are about to die on. Impacts should land hard. Bloom, particles, shaders, and the rest of Godot’s 2D effects are there to make hits feel crisp instead of muddy.

The title screen idea is the name collapsing into a pulsar, and that pulsar becoming the backdrop of the main menu and lobby.

## The Black Hole Solution

This is an early design note, not a release announcement. The public playtest is offline while we keep building.

!pic{"assets/images/blog/devlog_assets/map_change_plans.png"}["Godot map change plans"]#map#gamedesign

The target is a 6 to 12 month production once a Kickstarter lands and hiring is underway, with a release window in Q3 or Q4 of 2027. The base game would ship with two optional downloadable packs, first offered during that campaign.

The engine is Godot. Sound is planned around FMOD, if it holds up on every platform we export to. Everyone on the project needs to be comfortable in Godot or something close to it. The shape of the team, if the campaign supports it: a gameplay designer and programmer, a network engineer when multiplayer needs one, an art director, contract artists as the shots require them, a sound designer and composer, a social lead, and a second programmer if the schedule asks for it.

Until then, the short version stays the same. Build. Fly. Fight. Repeat.