const fs = require('fs');
const path = require('path');

// We have the OCR text of all 25 pages from the PDF
// Let's create the array of 1176 games:
const ocrPages = [
`1. 10 Second Ninja X
2. 007 First Light
3. 112 Operator
4. 12 Labours of Hercules
5. 12 Labours of Hercules II: The Cretan Bull
6. 12 Labours of Hercules III: Girl Power
7. 12 Labours of Hercules IV: Mother Nature
8. 12 Labours of Hercules V: Kids of Hellas
9. 16bit Trader
10. 3DRPG
11. 8BitBoy
12. 99 Levels To Hell
13. A Bird Story
14. A grande bagunça espacial - The big space mess
15. A New Beginning - Final Cut
16. A Plague Tale: Innocence
17. Aberoth
18. ACE - Arena: Cyber Evolution
19. Ace of Words
20. AdVenture Capitalist
21. AdVenture Communist
22. AdventureQuest 3D
23. Adventurer Manager
24. Age of Conquest IV
25. Age of Fear 2: The Chaos Lord GOLD
26. Age of Fear: The Undead King
27. Age of Invention
28. Age of Wonders
29. Age of Wonders III
30. Agent Awesome
31. AI War: Fleet Command
32. Airscape: The Fall of Gravity
33. Alan Wake
34. Alan Wake's American Nightmare
35. Alchemy Garden
36. Alien Breed: Impact
37. Alien Shooter 2: Reloaded
38. Alien Swarm: Reactive Drop
39. Alien: Isolation
40. ALPAGES : THE FIVE BOOKS
41. Alpha Runner`,
`42. Alter World
43. American Truck Simulator
44. Amerzone: The Explorer’s Legacy (1999)
45. Amigdala
46. Amnesia: The Dark Descent
47. Among the Heavens
48. Among Us
49. Ampersand
50. Ampu-Tea
51. Angeldust
52. ANKI
53. Anomaly Korea
54. Anomaly Warzone Earth
55. Anomaly Warzone Earth Mobile Campaign
56. Anoxemia
57. Apewar
58. AppGameKit Classic
59. AR-K
60. Argo
61. ARK: Survival Evolved
62. Arkhelom 3D
63. Assassin's Creed II
64. Assassin's Creed III Remastered
65. Assassin's Creed Odyssey
66. Assassin's Creed Valhalla
67. Assetto Corsa
68. Astroneer
69. Atom Fishing II
70. Avencast
71. Aveyond 3-2: Gates of Night
72. Awe
73. Awesome Metal Detecting
74. Awkward Girls
75. AX:EL
76. Axis Football 2015
77. Back to the Future: Ep 1 - It's About Time
78. Back to the Future: Ep 2 - Get Tannen!
79. Back to the Future: Ep 3 - Citizen Brown
80. Back to the Future: Ep 4 - Double Visions
81. Back to the Future: Ep 5 - OUTATIME
82. Backrooms: Escape Together
83. Bad Rats
84. BADLAND: Game of the Year Edition
85. Balatro
86. Baldur's Gate 3
87. Baldur's Gate: Enhanced Edition
88. Ball lab
89. BALL x PIT`,
`90. Ballpoint Universe: Infinite
91. Barro F
92. Barro GT
93. Bastion
94. Batman: Arkham Asylum GOTY Edition
95. Batman: Arkham City GOTY
96. Batman™: Arkham Knight
97. Battle Ranch
98. Beast of Reincarnation
99. BattleBlock Theater
100. BattleBlock Theater®
101. Battlefield: Bad Company™ 2
102. Battlepaths
103. Battlestar Galactica Deadlock
104. Bayonetta
105. BeatBlasters III
106. BEEP
107. Before Your Eyes
108. Beholder
109. Bell Ringer
110. Ben There, Dan That!
111. Betrayer
112. Beyond Divinity
113. Beyond: Two Souls
114. Big Fish Legend
115. Billies Wheelie
116. Binary Domain
117. Biodrone Battle
118. Bionic Commando Rearmed
119. Bionic Dues
120. BioShock
121. BioShock 2
122. BioShock 2 Remastered
123. BioShock Infinite
124. BioShock Remastered
125. Bioshok 2 Remastered
126. Bioshok Remastered
127. Bitburner
128. Bizarre Earthquake
129. Black Desert
130. Black Mesa
131. BlackShadows
132. Blasphemous
133. Blaster Shooter GunGuy!
134. Blender
135. Block Story
136. BLOCKPOST LEGACY
137. Blockstorm`,
`138. Bloo Kid 2
139. Blood and Bacon
140. BloodRayne: Betrayal (Legacy)
141. Bloodstained: Ritual of the Night
142. Bloop
143. Blue Prince
144. Blueprint Tycoon
145. Bomber Crew
146. Booster Racers
147. Borderlands 2
148. Borderlands 3
149. Bosorka
150. Botology
151. BRAIN / OUT
152. BRAINPIPE: A Plunge to Unhumanity
153. Brawlhalla
154. Breath of Death VII
155. Bridge Constructor Medieval
156. Bridge Constructor Playground
157. BRINK
158. Broken Dreams
159. Brothers - A Tale of Two Sons
160. Brütal Legend
161. Buckshot Roulette
162. Bullet Life 2010
163. Bully: Scholarship Edition
164. Burgers
165. Cakey's Twisted Bakery
166. Call of Juarez Gunslinger
167. Call to Arms
168. Cally's Caves 3
169. Camera Obscura
170. Campaign Clicker
171. Canyon Capers
172. Capcom Arcade Stadium
173. Car Mechanic Simulator 2014
174. Car Mechanic Simulator 2021
175. Card Hunter
176. Cards and Castles
177. Caribbean Crashers
178. Cast & Spell
179. Caster
180. Castle Crashers
181. Castle Story
182. Castlevania: Lords of Shadow - Ultimate Edition
183. Castlevania: Lords of Shadow 2
184. Castlevania: Lords of Shadow – Mirror of Fate HD
185. Catherine Classic`,
`186. Caveman World: Mountains of Unga Boonga
187. Celeste
188. Cell to Singularity - Evolution Never Ends
189. Chaos Domain
190. Chaos on Deponia
191. Children of Morta
192. Chime Sharp
193. Chip
194. Chivalry: Medieval Warfare
195. CHRONO TRIGGER
196. Cities: Skylines
197. Clair Obscur: Expedition 33
198. Clergy Splode
199. Clicker Guild
200. Clicker Heroes
201. Clones
202. Cobi Treasure Deluxe
203. Command & Conquer™ Red Alert™ 3- Uprising
204. Commando Jack
205. Company of Heroes 2
206. Condemned: Criminal Origins
207. CONSORTIUM 2014
208. CONSORTIUM Remastered
209. Content Warning
210. Control Ultimate Edition
211. Cook, Serve, Delicious!
212. Cookie Clicker
213. Core Keeper
214. Cortex Command
215. Cosmic Dust & Rust
216. Cossacks: Back to War
217. Counter-Strike
218. Counter-Strike 2
219. Counter-Strike: Condition Zero
220. Counter-Strike: Condition Zero Deleted Scenes
221. Counter-Strike: Source
222. Craft The World
223. Crash Time 2
224. Crazy Machines 2
225. Crazy Machines 3
226. Creature Clicker - Capture, Train, Ascend!
227. Crime Boss: Rockay City
228. Crossout
229. Crowalt: Traces of the Lost Colony
230. Crusader Kings II
231. Crusaders of the Lost Idols
232. Crush Crush
233. Crypt of the NecroDancer`,
`234. Crystals of Time
235. Cthulhu Saves the World
236. Cube Destroyer
237. Cubetractor
238. Cubicle Quest
239. Cubot
240. Cult of the Lamb
241. Cult of the Wind
242. Cyberpunk 2077
243. Dark and Darker
244. DARK SOULS™: Prepare To Die Edition
245. Darkest Dungeon®
246. Darkness Assault
247. Darksiders
248. Darksiders II Deathinitive Edition
249. Darksiders Warmastered Edition
250. DashBored
251. Dashy Square
252. Data Hacker: Corruption
253. Data Hacker: Reboot
254. Data Jammers: FastForward
255. DAVE THE DIVER
256. Day of Defeat
257. Day of Defeat: Source
258. Dead Bits
259. Dead by Daylight
260. Dead Cells
261. Dead Island 2
262. Dead Island Riptide Definitive Edition
263. Dead Island: Epidemic
264. Deadlight
265. DEATH STRANDING DIRECTOR'S CUT
266. Deathmatch Classic
267. Deep Rock Galactic
268. Defend Your Life
269. Defy Gravity
270. DELTARUNE (Chapter 1 & 2 DEMO)
271. Deponia
272. Deponia Doomsday
273. Deponia: The Complete Journey
274. Depth
275. Depth Hunter 2: Deep Dive
276. Desktop Dungeons
277. Despair
278. Destiny 2
279. Destiny Warriors
280. DETOUR
281. Detroit: Become Human`,
`282. Deus Ex: Human Revolution - Director's Cut
283. Deus Ex: Mankind Divided™
284. Devil May Cry 5
285. Dino D-Day
286. Dinosaur Hunt
287. DiRT 4
288. DiRT Rally
289. DiRT Rally 2.0
290. Dirty Bomb
291. Disciples III: Renaissance
292. Disciples III: Resurrection
293. Disco Elysium
294. Dishonored 2
295. Dishonored RHCP
296. Disillusions Manga Horror
297. Dispatch
298. Distant Space 2
299. DISTRAINT: Deluxe Edition
300. Divide by Sheep
301. Divine Divinity
302. Divinity II: Developer's Cut
303. Divinity: Original Sin (Classic)
304. Divinity: Original Sin 2
305. Divinity: Original Sin Enhanced Edition
306. DogFighter
307. DOKA 2 KISHKI EDITION
308. Doki Doki Literature Club
309. Don't Starve
310. Don't Starve Together
311. Doodle God
312. Doodle Kingdom
313. Doom
314. DOOM Eternal
315. Doorways: Prelude
316. Doorways: The Underworld
317. Dota 2
318. DR LIVESEY ROM AND DEATH EDITION
319. DRACOMATON
320. Dracula's Legacy
321. Dracula: The Resurrection
322. DRAGON: A Game About a Dragon
323. Dragonia
324. Draw a Stickman: EPIC
325. Draw Slasher
326. Drift Streets Japan
327. Drug Dealer Simulator
328. Dude Simulator 2
329. Dungeon of the ENDLESS™`,
`330. Dungeon Souls
331. Dungeons - The Dark Lord
332. DungeonUp
333. Dwelvers
334. Dying Light
335. Earth 2150 Trilogy
336. Earth 2150: Lost Souls
337. Earth 2150: The Moon Project
338. East India Company
339. Eaten Alive
340. Edna & Harvey: Harvey's New Eyes
341. EGG
342. Egg Surprise
343. ELDEN RING
344. Eleusis
345. Enclave
346. Enderal: Forgotten Stories
347. Enderal: Forgotten Stories (Special Edition)
348. ENDLESS™ Space - Definitive Edition
349. Endorlight
350. Enemy Mind
351. Entropy : Zero 2
352. Epic Clicker Journey
353. Epigenesis
354. EPSILON
355. Escape Machines
356. Escape Room - The Sick Colleague
357. Eternal Fate
358. Eternal Step
359. Euro Truck Simulator 2
360. Everreach: Project Eden
361. Evil Inside - Prologue
362. Evolvation
363. Evolve Stage 2
364. Experience 112
365. F1 2015
366. Fable - The Lost Chapters
367. Face It - A game to fight inner demons
368. Factorio
369. Faeria
370. Faerie Solitaire
371. Faerie Solitaire Remastered
372. FaeVerse Alchemy
373. Fahrenheit: Indigo Prophecy Remastered
374. Fake Colours
375. Fallout 3
376. Fallout 4
377. Fallout Shelter`,
`378. FINAL FANTASY VII REMAKE INTERGRADE
379. Fallout: New Vegas PCR
380. Fantasy General II
381. Fantasy Tales Online
382. Far Cry 5
383. Far Cry New Dawn
384. Far Cry® 3 Blood Dragon
385. Farm Frenzy 4
386. fault - milestone one
387. Fearless Fantasy
388. Fears to Fathom - Episode 1
389. Fester Mudd: Curse of the Gold - Episode 1
390. Field of Glory II: Medieval
391. Figment
392. FINAL FANTASY X/X-2 HD Remaster
393. Fingerbones
394. Firestone - idle online RPG clicker
395. Firewatch
396. Fishing Planet
397. Fistful of Frags
398. Five Nights at Freddy's
399. Flesh Eaters
400. Flight of the Paladin
401. Flix The Flea
402. For Honor
403. For Honor - Public Test
404. Forbidden Planet
405. Foreign Legion: Multi Massacre
406. Forge of Gods (RPG)
407. FortressCraft Evolved
408. Forts
409. Freddy Fazbear's Pizzeria Simulator
410. Frederic: Resurrection of Music
411. Frostpunk
412. Full Mojo Rampage
413. Fuse
414. GabeN: The Final Decision
415. Game Corp DX
416. Game Dev Tycoon
417. Gamecraft
418. GameGuru Classic
419. Garfield Kart
420. Garfield Kart - Furious Racing
421. Garry's Mod
422. GEO Master
423. Geometry Dash
424. Ghostrunner
425. Ghostrunner Demo`,
`426. Giana Sisters: Twisted Dreams
427. Giana Sisters: Twisted Dreams - Rise of the Owlverlord
428. Gimbal
429. Glacier 3: The Meltdown
430. GLAD VALAKAS SIMULATOR
431. Gladiator Trainer
432. Glass Wing
433. Glorkian Warrior: The Trials Of Glork
434. GOAT OF DUTY
435. God Awe-full Clicker
436. God Game : The Odyssey
437. God of War
438. God of War Ragnarok
439. God's Trigger
440. Gods vs Humans
441. Going Under
442. Goodbye Deponia
443. Gothic 1 Classic
444. Gothic 3
445. Gothic II: Gold Classic
446. Governor of Poker 3
447. Grand Theft Auto V
448. gravilon
449. Greedventory
450. Greyfox
451. GRID 2
452. GRID Autosport
453. Grim Clicker
454. Grim Dawn
455. Grimm
456. Grimoire: Manastorm
457. Guacamelee! Gold Edition
458. Guacamelee! Super Turbo Championship Edition
459. Guild Quest
460. Gothic 1 Remake
461. Gun Metal
462. Gun Rocket
463. Guns of Icarus Online
464. Guns'N'Zombies
465. GUNTOUCHABLES
466. Hacknet
467. Hades
468. Hades II
469. Half-Life
470. Half-Life 2
471. Half-Life 2: Deathmatch
472. Half-Life 2: Episode One
473. Half-Life 2: Update`,
`474. Half-Life Alyx
475. Half-Life Deathmatch: Source
476. Halls of Torment
477. Halo Infinite
478. Halo: The Master Chief Collection
479. Hamlet or the last game without MMORPG features
480. Hare In The Hat
481. Haste
482. Heaven Forest - VR MMO
483. Heaven Island - VR MMO
484. Heaven Island Life
485. Heavy Bullets
486. Heavy Dreams
487. Heckabomb
488. Hektor
489. Hell Yeah!
490. Hellblade: Senua's Sacrifice
491. Hellblade: Senua's Sacrifice VR Edition
492. Hello Neighbor Pre-Alpha
493. Hellslave
494. Hero Siege
495. Heroes of Scene
496. Heroine's Quest: The Herald of Ragnarok
497. Hi-Fi RUSH
498. Hidden Object Bundle 5 in 1
499. High On Racing
500. High Profits
501. HITMAN 1 GOTY
502. HITMAN 2
503. Hitman 2: Silent Assassin
504. HITMAN 3
505. HITMAN World of Assassination
506. Hitman: Absolution
507. Hitman: Blood Money
508. Hitman: Sniper Challenge
509. HITMAN™ 2
510. Holodrive
511. Holy Clash Cards
512. Holy Potatoes! A Spy Story?!
513. Holy Potatoes! A Weapon Shop?!
514. Holy Potatoes! We’re in Space?!
515. Holy Potatoes! What the Hell?!
516. Homefront
517. Hood Story: Kaito Yamazaki
518. Hostile Waters: Antaeus Rising
519. Hotline Miami
520. Hotline Miami 2: Wrong Number`,
`521. Hotshot Racing
522. House Flipper
523. House of Caravan
524. House of Detention
525. How to Survive
526. How to Survive 2
527. How To Survive Third Person
528. Hue
529. Human Fall Flat
530. Humanity Asset
531. Hunger Dungeon
532. Hungry Flame
533. Hyper Fighters
534. Hyperdrive Massacre
535. I, Zombie
536. iBomber Defense Pacific
537. Ichi
538. Idle Champions of the Forgotten Realms
539. Iesabel
540. Immortals Fenyx Rising
541. Immune
542. In Between
543. Incoming + Incoming Forces
544. Indie Game Battle
545. Infinite Crisis™
546. Influent
547. Initia: Elemental Arena
548. Injustice™ 2
549. Insanity Clicker
550. Insurgency
551. Intergalactic Bubbles
552. Into The War
553. Invasion: Brain Craving
554. Ionball 2 : Ionstorm
555. Iron Snout
556. Iron Storm
557. Isle of Jura
558. It Takes Two
559. I’m not a Monster
560. Jacob's Quest Anniversary Edition
561. Jet Gunner
562. JDM: Japanese Drift Master
563. Jet Set Radio
564. Job the Leprechaun
565. Jotun: Valhalla Edition
566. Journey of a Roach
567. Journey To The Center Of The Earth
568. Just Cause 2`,
`569. Just Cause 3
570. Kathy Rain
571. Keep Talking and Nobody Explodes
572. Killing Floor
573. Killing Floor 2
574. King's Bounty: Armored Princess
575. King's Bounty: Crossworlds
576. King's Bounty: Dark Side
577. King's Bounty: The Legend
578. King's Bounty: Warriors of the North
579. Kingdom Come: Deliverance
580. Kingdom Come: Deliverance 2
581. Kingdom Two Crowns
582. King’s Bounty: Legions
583. Kitchen Wars
584. Kivi, Toilet and Shotgun
585. Knights and Merchants
586. Knights of Pen and Paper +1
587. Knights of Pen and Paper 2
588. KnightShift
589. Kopanito All-Stars Soccer
590. Krater
591. Kraven Manor
592. Kung Fu Strike: The Warrior's Rise
593. Labyronia RPG
594. Labyronia RPG 2
595. Layers of Fear (2016)
596. Learn to Fly 3
597. Left 4 Dead 2
598. Legend of Mysteria
599. Legends of Idleon MMO
600. LEGO® Batman™ 2: DC Super Heroes
601. LEGO® Batman™ 3: Beyond Gotham
602. LEGO® Batman™: The Videogame
603. LEGO® City Undercover
604. LEGO® Harry Potter: Years 1-4
605. LEGO® Harry Potter: Years 5-7
606. LEGO® MARVEL Super Heroes
607. LEGO® The Hobbit™
608. LEGO® The Lord of the Rings™
609. LEGO® Worlds
610. Lethal Company
611. Lethal League Blaze
612. Leviathan: The Last Day of the Decade
613. Liar's Bar
614. Lies of P
615. Life is Strange 2
616. Life is Strange: Before the Storm`,
`617. Life is Strange™
618. Like a Dragon: Infinite Wealth
619. Lilly and Sasha: Curse of the Immortals
620. Lilly Looking Through
621. LIMBO
622. Litil Divil
623. Little Nightmares
624. Lone Leader
625. Loot Box Quest
626. Loot Box Simulator 20!8
627. Lossless Scaling
628. Love is Blind: Mutants
629. Lowglow
630. Lup
631. macdows 95
632. Machinika: Museum
633. Magicka
634. Magicka 2
635. Make it indie!
636. Maneater
637. Manhunter
638. Marble Age
639. Marble Mayhem: Fragile Ball
640. Marine Sharpshooter II: Jungle Warfare
641. Marvel’s Spider-Man Remastered
642. Masked Shooters 2
643. Mass Effect 1
644. Mass Effect 2
645. Mass Effect 3
646. Mass Effect™ Legendary Edition
647. Massive Cleavage vs Zombies: Awesome Edition
648. Mata Hari
649. McOsu
650. Mechanic Escape
651. Megabonk
652. Melissa K. and the Heart of Gold Collector's Edition
653. Memoria
654. Memories of a Vagabond
655. Merchants of Kaidan
656. METAL GEAR SOLID Δ: SNAKE EATER
657. Metaphor: ReFantazio
658. Metro 2033
659. Metro 2033 Redux
660. Metro: Last Light Complete Edition
661. Metro: Last Light Redux
662. Microcosmum: survival of cells
663. Microtransaction Simulator
664. Midas Gold Plus`,
`665. Mindless Running
666. Mini Thief
667. Minion Masters
668. Monday Night Combat
669. Monster Truck Destruction
670. Monsti
671. Moonscars
672. Morphopolis
673. Mortal Kombat X
674. Mother Russia Bleeds
675. Mountain Crime: Requital
676. Muck
677. Munin
678. Murder Miners
679. MURDERED: SOUL SUSPECT™
680. Muse Dash
681. My Lands
682. N.P.P.D. RUSH - The milk of Ultra violet
683. Naninights
684. NARUTO SHIPPUDEN: Ultimate Ninja STORM 4
685. Necesse
686. NEKOPARA Vol. 0
687. Neverwinter
688. New kind of adventure
689. NGU IDLE
690. NieR:Automata™
691. NightSky
692. Ninja Stealth
693. Ninja Stealth 2
694. Ninja Stealth 4
695. NO THING
696. Normality
697. No Man's Sky
698. Nosferatu: The Wrath of Malachi
699. Nostradamus: The Last Prophecy
700. Not The Robots
701. Notrium
702. NEEDY STREAMER OVERLOAD
703. NotTheNameWeWanted
704. Numba Deluxe
705. Nux
706. Nyctophobia
707. Octodad: Dadliest Catch
708. Oddworld: Abe's Oddysee
709. Odd||Even
710. Odysseus Kosmos and his Robot Quest - Episode 1
711. Office Battle
712. Omikron - The Nomad Soul`,
`713. On A Roll 3D
714. One Dog Story
715. One Way To Die
716. OpenTTD
717. Orbital Gear
718. Orborun
719. Orcs Must Die!
720. Orcs Must Die! 2
721. Ori and the Blind Forest: Definitive Edition
722. ORION: Prelude
723. Orvell
724. Our Darker Purpose
725. Out There Somewhere
726. Outcore
727. OutDrive
728. Outlast
729. Outlast 2
730. Overcast - Walden and the Werewolf
731. Overcooked
732. Oxygen Not Included
733. Paladins
734. Palworld
735. Particula
736. Path of Exile
737. PAYDAY 2
738. PAYDAY: The Heist
739. PEAK
740. Penguins Arena: Sedna's World
741. Penny Arcade's On the Rain-Slick Precipice of Darkness 3
742. Penny Arcade's On the Rain-Slick Precipice of Darkness 4
743. Penumbra: Necrologue
744. People Playground
745. PERFECT ANGLE: The puzzle game based on optical illusions
746. Persona 3 Reload
747. Persona 5 Royal
748. Persona 5 Strikers
749. Pet Lands
750. Phasmophobia
751. Pick a Hero
752. Pid
753. Pirates Vikings & Knights II
754. Pixel Puzzles Traditional Jigsaw Puzzles
755. Pixel Puzzles: Japan
756. PixelJunk™ Monsters Ultimate
757. Planet Coaster
758. Plantera
759. Plants vs. Zombies GOTY Edition
760. Plazma Being`,
`761. Plush
762. Poker Night at the Inventory (2010 Original Version)
763. Polarity
764. PONCHO
765. Pongo
766. Portal
767. Portal 2
768. Portal 2 - The Final Hours
769. Portal Knights
770. Portal: Revolution
771. Post Mortem
772. POSTAL
773. POSTAL 2
774. Potionomics
775. Power-Up
776. Press any button
777. Press X to Not Die
778. Pressured
779. Prey
780. Primal Carnage: Extinction
781. Princess Remedy In A Heap of Trouble
782. Project CARS
783. Project Zomboid
784. Prominence Poker
785. PROTOTYPE 2
786. Punch Club
787. Purple Place - Classic Games
788. Putin Life
789. Puzzle Agent
790. Puzzle Agent 2
791. Pyre
792. Q.U.B.E.
793. Q.U.B.E. 2
794. Q.U.B.E: Director's Cut
795. Qbeh-1: The Atlas Cube
796. Quantum Break
797. QuestRun
798. R.E.P.O.
799. Racer 8
800. RADical ROACH Remastered
801. Raft
802. Ragnarok Clicker
803. Randal's Monday
804. Rats - Time is running out!
805. Razenroth
806. RC Cars
807. Really Big Sky
808. Realm Grinder`,
`809. Realms of the Haunting
810. Red Dead Redemption 2
811. Reigns
812. Reigns: Her Majesty
813. Relic Hunters Zero: Remix
814. Rain World
815. Renegade Ops
816. Resident Evil 2
817. Resident Evil 4 Remake
818. Resident Evil 7 Biohazard
819. Resident Evil Re:Verse
820. Resident Evil Village
821. Revolution Ace
822. Rhino's Rage
823. Ricochet
824. RIFT
825. RiME
826. RimWorld
827. Rise of the Ancients
828. Rise of the Tomb Raider
829. Risen
830. Risk of Rain 2
831. Roadwarden
832. Robin Hood
833. Robotex
834. Rocketbirds: Hardboiled Chicken
835. Rolling Sun
836. Romance of the Three Kingdoms Maker
837. ROMEO IS A DEAD MAN
838. Rover Rescue
839. Royal Defense
840. RUINER
841. Run Run And Die
842. Rusty Lake Hotel
843. S.T.A.L.K.E.R. 2: Heart of Chornobyl
844. Sacred 3
845. Sacred Citadel
846. Saints Row IV
847. Saints Row: Gat out of Hell
848. Saints Row: The Third
849. Saira
850. Sakura Clicker
851. Sam & Max 301: The Penal Zone
852. Sam & Max 302: The Tomb of Sammun-Mak
853. Sam & Max 303: They Stole Max's Brain!
854. Sam & Max 304: Beyond the Alley of the Dolls
855. Sam & Max 305: The City that Dares not Sleep
856. SAMOLIOTIK`,
`857. Sanctum
858. Sanctum 2
859. Satellite Reign
860. Saviors
861. Schedule I
862. School of Dragons: How to Train Your Dragon
863. SCP: Containment Breach Multiplayer
864. Scrap Mechanic
865. Scritchy Scratchy
866. Sea of Thieves
867. Secret Of Magia
868. See No Evil
869. SEGA Mega Drive & Genesis Classics
870. Sekiro™: Shadows Die Twice
871. Septerra Core
872. Serena
873. Serious Sam 2
874. Stray
875. Serious Sam Fusion 2017 (beta)
876. Serious Sam HD: The First Encounter
877. Sex Diary - Futanari Jail
878. Shadow Tactics: Blades of the Shogun
879. Shadow Warrior
880. Shadowrun Returns
881. Shadows on the Vatican - Act I: Greed
882. Shakes and Fidget
883. ShipLord
884. Shop Heroes
885. Sid Meier's Civilization V
886. Sid Meier's Civilization VI
887. Sid Meier’s Civilization® VI
888. Simulator of Ukraine 1991
889. Sins Of The Demon RPG
890. Sixtieth Kilometer
891. Skyborn
892. Skyforge
893. Slay the Spire
894. Slime Rancher
895. Slipstream 5000
896. Slots & Daggers
897. Sniper Elite 4
898. Snuggle Truck
899. Soda Dungeon
900. Solar Division
901. Solar Flux
902. SOMA
903. Sonic & All-Stars Racing Transformed Collection
904. Sonic Adventure DX`,
`905. Sonic Adventure™ 2
906. Sonic Frontiers
907. Sonic Generations
908. Sons of the Forest
909. SOS OPS!
910. Soul Gambler
911. Soulbringer
912. Source of Madness
913. South Park The Fractured But Whole
914. South Park™: The Stick of Truth™
915. Space Crew: Legendary Edition
916. Space Engineers
917. Space Hack
918. Space Pilgrim Episode I: Alpha Centauri
919. Space Pilgrim Episode II: Epsilon Indi
920. Space Pilgrim Episode III: Delta Pavonis
921. Space Pilgrim Episode IV: Sol
922. SpaceCorn
923. Sparkle 2 Evo
924. Sparkle 3 Genesis
925. Speedball 2 HD
926. Spellweaver
927. Spheroid
928. Spiral Knights
929. Splatter - Zombiecalypse Now
930. Spoiler Alert
931. Spooky's Jump Scare Mansion
932. Squarelands
933. Squirbs
934. Squishy the Suicidal Pig
935. Starbound
936. Stardew Valley
937. Stargazer
938. SteamWorld Dig
939. SteamWorld Dig 2
940. SteamWorld Heist
941. SteamWorld Heist II
942. SteamWorld Quest: Hand of Gilgamech
943. Steel & Steam: Episode 1
944. STEINS;GATE
945. Stellar 2D
946. Stick Fight: The Game
947. Stick RPG 2
948. STONKS-9800: Stock Market Simulator
949. Stormworks: Build and Rescue
950. Story Of the Survivor
951. Streamline
952. Street Racing Syndicate`,
`953. Strider
954. Subnautica
955. Suits: A Business RPG
956. Summer in Mara
957. Sumo Revise
958. Sun Blast
959. SUPER DISTRO
960. Super Fantasy Kingdom
961. Super Killer Hornet: Resurrection
962. Super Meat Boy
963. Super Mustache
964. Super Trench Attack!
965. Superliminal
966. Supraball
967. Supraland
968. Surfingers
969. Surgeon Simulator
970. Survive the Nights
971. Swag and Sorcery
972. SWEET FEETS
973. Swipecart
974. Syberia
975. Syberia 2
976. Taimumari: Definitive Edition
977. Tales from Space: Mutant Blobs Attack
978. Tales of the Orient: The Rising Sun
979. Talisman: Prologue
980. Tap Adventure: Time Travel
981. Tap Heroes
982. Tap Tap Infinity
983. Tasty Planet: Back for Seconds
984. Tavern Keeper
985. TCG Card Shop Simulator
986. Tea Party Simulator 2015™
987. Team Fortress 2
988. Techwars Online
989. Teddy Floppy Ear - Kayaking
990. Teddy Floppy Ear - Mountain Adventure
991. Teddy Floppy Ear - The Race
992. Terra Incognita Chapter One: The Descendant
993. Terra Lander Remastered
994. Terraria
995. Terrorhedron
996. TGV Voyages Train Simulator
997. The Adventures of Mr. Bobley
998. The Adventures of Tree
999. The Albino Hunter™ (Original)
1000. The Archotek Project`,
`1001. The Awesome Adventures of Captain Spirit
1002. The Binding of Isaac
1003. The Binding of Isaak: Rebirth
1004. The Blue Flamingo
1005. The Book of Legends
1006. The Chosen RPG
1007. The Crew 2
1008. The Culling Of The Cows
1009. The Dark Stone from Mebara
1010. The Deed
1011. The Deer
1012. The Descendant
1013. The Invincible
1014. The Egyptian Prophecy: The Fate of Ramses
1015. The Elder Scrolls V: Skyrim
1016. The Elder Scrolls V: Skyrim Special Edition
1017. The Entente Gold
1018. The Entropy Centre
1019. The Expendabros
1020. The Forest
1021. The God's Chain
1022. The Hat Man: Shadow Ward
1023. The Howler
1024. The I of the Dragon
1025. The Incredible Adventures of Van Helsing
1026. The Incredible Adventures of Van Helsing II
1027. The Inner World
1028. The Binding of Isaac: Rebirth
1029. The Journey Down: Chapter One
1030. The Last Hope
1031. The Last NightMary - A Lenda do Cabeça de Cuia
1032. The Lion\`s song
1033. The Long Dark
1034. The Long Drive
1035. The Lord of the Rings Online™
1036. The Murder of Sonic the Hedgehog
1037. The Night of the Rabbit
1038. The Pirate: Caribbean Hunt
1039. The Red Solstice
1040. The Stanley Parable
1041. The Talos Principle
1042. The Texas Chain Saw Massacre
1043. The Troma Project
1044. The Walking Dead
1045. The Walking Dead: 400 Days
1046. The Walking Dead: Michonne
1047. The Walking Dead: Saints & Sinners
1048. The Walking Dead: Season 2`,
`1049. The Walking Dead: Season 3
1050. The Walking Dead: The Final Season
1051. The Walking Dead: The Telltale Definitive Series
1052. The Whispered World Special Edition
1053. The Witcher 2: Assassins of Kings Enhanced Edition
1054. The Witcher Adventure Game
1055. The Witcher: Enhanced Edition
1056. The Wolf Among Us
1057. Theatre of War
1058. Theatre of War 2: Africa 1943
1059. They Breathe
1060. Thief
1061. Thief Gold
1062. This Is the Police
1063. This War of Mine
1064. Three Heroes
1065. Timberman
1066. Time Clickers
1067. Time Gentlemen, Please!
1068. Tinboy
1069. Tiny Bridge: Ratventure
1070. Titan Quest Anniversary Edition
1071. Titan Quest II
1072. Titan Souls
1073. tModLoader
1074. To the Core
1075. To the Moon
1076. Toadled
1077. Tom Clancy's Ghost Recon® Wildlands
1078. Tom Clancy's Rainbow Six Siege
1079. Tomb Raider
1080. Top Trumps Turbo
1081. Torchlight
1082. Toribash
1083. Total War: SHOGUN 2
1084. Transformice
1085. Transistor
1086. TRAPPED
1087. Tribes of Midgard
1088. Trine
1089. Trine 2
1090. Tropico
1091. Tropico 2: Pirate Cove
1092. Tropico 3 - Steam Special Edition
1093. Tropico 3: Absolute Power
1094. Trove
1095. Tumblestone
1096. Turbo Pug`,
`1097. Two Worlds: Epic Edition
1098. UBERMOSH
1099. Ubinota
1100. Ukrainian Ninja
1101. Ultimate Chicken Horse
1102. Ultimate Custom Night
1103. Ultimate General: Gettysburg
1104. Ultimate Zombie Defense
1105. Undefeated
1106. Undertale
1107. Unepic
1108. UNLOVED
1109. Unplagued
1110. Unravel Two
1111. Unturned
1112. Uplink
1113. Urban Trial Freestyle
1114. Uriel's Chasm
1115. V Rising
1116. Valheim
1117. Vampire Crawlers
1118. Vampire Survivors
1119. Vanguard Princess
1120. Vapour
1121. Vegas: Make It Big
1122. Velvet Assassin
1123. Vertical Drop Heroes HD
1124. Vertiginous Golf
1125. Victim of Xen
1126. Viking: Battle for Asgard
1127. Villagers and Heroes
1128. Violett
1129. Virginia
1130. Viscera Cleanup Detail: Shadow Warrior
1131. Voidigo
1132. VRChat
1133. Warframe
1134. Warhammer 40,000: Eternal Crusade
1135. Warhammer 40,000: Gladius - Relics of War
1136. Warhammer 40,000: Mechanicus
1137. Warhammer 40,000: Space Marine - Anniversary Edition
1138. Wave Mechanics
1139. Waveform
1140. We Are The Dwarves
1141. Weapons Genius
1142. White Mirror
1143. Wickland
1144. Wild Island Quest`,
`1145. Will Fight for Food: Super Actual Sellout: Game of the Hour
1146. Windblown
1147. Winter Novel
1148. Witch It
1149. Wobbly Jungle
1150. Wolfenstein II: The New Colossus
1151. Woodle Tree Adventures
1152. World of Goo
1153. World War II: Panzer Claws
1154. Wrath of Anna
1155. Wreckfest
1156. Wuthering Waves
1157. X-Blades
1158. X-COM: UFO Defense
1159. Yakuza: Like a Dragon
1160. Yargis - Space Melee
1161. Year Walk
1162. Yet Another Zombie Defense
1163. Your Friend Hana
1164. Yume Nikki
1165. Zero Hour
1166. Zombie Pirates
1167. Zombie Playground™
1168. The Witcher 3: Wild Hunt
1169. War on Folvos
1170. Hero of the Kingdom II
1171. Melinium
1172. LIZARDS MUST DIE
1173. Minesweeper Tetris
1174. House Flipper
1175. Hogwarts Legacy
1176. Kholat - Dyatlov Pass`
];

const games = [];
for (const page of ocrPages) {
  const lines = page.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // match pattern like: 123. Game Name
    const match = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (match) {
      games.push({
        id: parseInt(match[1], 10),
        title: match[2].trim()
      });
    }
  }
}

console.log('Total games extracted:', games.length);

const targetPath = path.join(__dirname, 'frontend', 'public', 'assets', 'games_list.json');
fs.writeFileSync(targetPath, JSON.stringify(games, null, 2), 'utf8');
console.log('Successfully written to', targetPath);
