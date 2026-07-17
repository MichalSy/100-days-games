import type { GameCard } from '../types';

const START_DATE = '2026-06-11';

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function generatedDate(game: Partial<GameCard> | undefined): string | undefined {
  return game?.generatedAt ? isoDate(new Date(game.generatedAt)) : undefined;
}

const generatedGames: Record<number, Partial<GameCard>> = {
  1: {
    status: 'generated',
    title: 'Koi Lantern Drift',
    slug: 'koi-lantern-drift',
    genre: ['calm arcade', 'path-planning', 'collection'],
    mode: '2d',
    description: 'Guide a luminous koi through a moonlit Japanese garden pond, collect lantern sparks, and keep the central festival lantern lit through shifting currents.',
    objective: 'Reach 1200 points for Festival Bloom, build spark combos, and survive as long as possible.',
    playUrl: '/akari/',
    promptUrl: '/akari/prompt.html',
    promptExcerpt: 'Keep the festival lantern lit by collecting gold sparks while avoiding dark ripples and reeds.',
    screenshotUrl: '/akari/screenshot.png',
    generationDuration: 'manual subagent run',
    generatedAt: '2026-06-11T00:55:00Z'
  },
  2: {
    status: 'generated',
    title: 'Clockwork Cloud Courier',
    slug: 'clockwork-cloud-courier',
    genre: ['route-planning arcade', 'timed delivery', '2D'],
    mode: '2d',
    description: 'Pilot a brass bird-mail glider between floating post towers, using wind lanes and boost rings while avoiding turbulence and gear-storms.',
    objective: 'Deliver all glowing letters before time expires, earn 3 stars, and chase the Golden Dispatch score banner.',
    playUrl: '/tsubasa/',
    promptUrl: '/tsubasa/prompt.html',
    promptExcerpt: 'Deliver every glowing letter before the clock runs out by following tower numbers, wind lanes, and shortcut boost rings.',
    screenshotUrl: '/tsubasa/screenshot.png',
    generationDuration: 'manual subagent run ~50 minutes',
    generatedAt: '2026-06-11T03:52:00Z'
  },
  3: {
    status: 'generated',
    title: 'Neon Bonsai Skyforge',
    slug: 'neon-bonsai-skyforge',
    genre: ['spatial arcade crafting', 'ring-navigation', '3D'],
    mode: '3d',
    description: 'Pilot a luminous forge-drone through depth-separated bonsai rings, collect colored sap motes, avoid cracked lanterns, and bank upgrades at floating bonsai cores.',
    objective: 'Reach 2400 points and complete Root, Branch, and Blossom upgrades to trigger Skyforge Bloom, then continue the endless score chase.',
    playUrl: '/komorebi/',
    promptUrl: '/komorebi/prompt.html',
    promptExcerpt: 'Fly through 3D bonsai rings, collect sap, and forge all three upgrades before heat or hazards end the run.',
    screenshotUrl: '/komorebi/screenshot.png',
    generationDuration: 'manual subagent run ~75 minutes',
    generatedAt: '2026-06-12T04:10:00Z'
  },
  4: {
    status: 'generated',
    title: 'Hikari Firefly Cartographer',
    slug: 'hikari-firefly-cartographer',
    genre: ['path-drawing arcade puzzle', 'light-routing', 'mobile-first 2D'],
    mode: '2d',
    description: 'Draw glowing routes through a moonlit shrine garden to guide colored fireflies into matching lantern constellations before dawn.',
    objective: 'Complete three lantern constellations and reach 1800 points to trigger Hikari Dawn Map, then continue into endless shadow waves.',
    playUrl: '/hikari/',
    promptUrl: '/hikari/prompt.html',
    promptExcerpt: 'Draw short light paths, route fireflies by color, dodge moving shadows, and finish the Hikari Dawn Map before the garden clock reaches dawn.',
    screenshotUrl: '/hikari/screenshot.png',
    generationDuration: 'manual subagent run ~90 minutes',
    generatedAt: '2026-06-13T17:31:45Z'
  },
  5: {
    status: 'generated',
    title: 'Yume Lantern Railrunner',
    slug: 'yume-lantern-railrunner',
    genre: ['3D lane runner', 'dream-rail navigation', 'mobile-first arcade'],
    mode: '3d',
    description: 'Ride a tiny lantern tram through a dreamlike paper-theater night sky, switch rails in 3D depth, collect tickets, pass moon gates, and arrive before dawn.',
    objective: 'Reach 2600 points and clear Moon Platform, Paper Crane Bridge, and Dawn Bell Loop to trigger Yume Dawn Arrival, then continue into endless night-loop scoring.',
    playUrl: '/yume/',
    promptUrl: '/yume/prompt.html',
    promptExcerpt: 'Switch rails, collect dream tickets, pass glowing moon gates, avoid cracked nightmare tracks, and ring the Lucid Bell when the 3D path blurs.',
    screenshotUrl: '/yume/screenshot.png',
    generationDuration: 'manual subagent run ~100 minutes',
    generatedAt: '2026-06-14T01:43:31Z'
  },
  6: {
    status: 'generated',
    title: 'Sora Tideglass Observatory',
    slug: 'sora-tideglass-observatory',
    genre: ['3D puzzle arcade', 'moonbeam alignment', 'mobile-first hybrid'],
    mode: 'hybrid',
    description: 'Rotate prism towers on a floating sky observatory board to guide moonbeams through depth-aware paths into constellation receivers before the tideglass overflows.',
    objective: 'Complete Crane, Fox, and Dawn Gate constellations and reach 2200 points to trigger Sora Star-Tide Calibration, then continue into endless constellation waves.',
    playUrl: '/sora/',
    promptUrl: '/sora/prompt.html',
    promptExcerpt: 'Select prism towers, rotate moonbeam angles, charge constellation nodes, avoid eclipse shards, and stabilize the sky with Still Sky before the tideglass overflows.',
    screenshotUrl: '/sora/screenshot.png',
    generationDuration: 'manual subagent run ~120 minutes',
    generatedAt: '2026-06-15T01:44:30Z'
  },
  7: {
    status: 'generated',
    title: 'Nami Bento Tide Kitchen',
    slug: 'nami-bento-tide-kitchen',
    genre: ['time-management puzzle', 'conveyor cooking', 'mobile-first 2D'],
    mode: '2d',
    description: 'Run a bright seaside bento stall by catching tide-lane ingredients, filling customer orders in sequence, dodging crabs and wasabi decoys, and chaining clean service combos.',
    objective: 'Complete Morning Ferry, Lunch Bell, and Festival Rush while reaching 2400 points to trigger Nami Grand Bento Service, then continue into endless rush scoring.',
    playUrl: '/nami/',
    promptUrl: '/nami/prompt.html',
    promptExcerpt: 'Catch tide ingredients, drag or tap them into bento tray slots, satisfy customer order cards, calm the conveyor waves, and keep complaint shells away.',
    screenshotUrl: '/nami/screenshot.png',
    generationDuration: 'manual subagent run ~95 minutes',
    generatedAt: '2026-06-16T01:44:33Z'
  },
  8: {
    status: 'generated',
    title: 'Mori Mosslight Seedkeeper',
    slug: 'mori-mosslight-seedkeeper',
    genre: ['3D garden-routing strategy arcade', 'terrarium stewardship', 'mobile-first score chase'],
    mode: '3d',
    description: 'Inspect a miniature moss shrine board, rotate raised root tiles, place a temporary bridge, pulse a lantern, and route rolling dew beads into thirsty seedling basins before drought and soot mites overwhelm the grove.',
    objective: 'Complete Fern Steps, Cedar Gate, and Kodama Bloom while reaching 2600 points to trigger Mori Mosslight Bloom, then continue into endless forest-night scoring.',
    playUrl: '/mori/',
    promptUrl: '/mori/prompt.html',
    promptExcerpt: 'Rotate moss/root tiles in a 3D forest shrine, guide glowing dew through slopes and bridges into requested basins, and keep soot mites away with Mosslight.',
    screenshotUrl: '/mori/screenshot.png',
    generationDuration: 'manual subagent run with timeout recovery ~120 minutes',
    generatedAt: '2026-06-17T01:46:03Z'
  },
  9: {
    status: 'generated',
    title: 'Tsuki Shadow Puppet Troupe',
    slug: 'tsuki-shadow-puppet-troupe',
    genre: ['silhouette timing puzzle', 'stage-layer arcade', 'mobile-first hybrid'],
    mode: 'hybrid',
    description: 'Conduct a moonlit paper-theater troupe by sliding three shadow puppet rods through near, mid, and far rails, setting poses, collecting charms, and cueing silhouettes on the beat.',
    objective: 'Complete Candle Prologue, Fox-Moon Chase, and Silver Curtain Finale while reaching 2500 points to trigger Tsuki Full-Moon Ovation, then continue into endless encore scoring.',
    playUrl: '/tsuki/',
    promptUrl: '/tsuki/prompt.html',
    promptExcerpt: 'Pose puppets, slide rods across depth rails, match moon-script silhouette recipes, dodge lane-specific ink blots, and cue on the silver beat window.',
    screenshotUrl: '/tsuki/screenshot.png',
    generationDuration: 'manual subagent run with timeout recovery ~120 minutes',
    generatedAt: '2026-06-18T01:42:15Z'
  },
  10: {
    status: 'generated',
    title: 'Kaze Windbell Atelier',
    slug: 'kaze-windbell-atelier',
    genre: ['3D wind-routing puzzle', 'resonance arcade', 'mobile-first score chase'],
    mode: '3d',
    description: 'Tune a breezy hilltop atelier by rotating and pitch-tuning glass windbells so glowing gust ribbons ring requested note sequences while storm crows threaten the charms.',
    objective: 'Complete Porch Breeze, Lantern Eaves, and Storm-Calm Finale while reaching 2700 points to trigger Kaze Grand Chime, then continue into endless twilight commissions.',
    playUrl: '/kaze/',
    promptUrl: '/kaze/prompt.html',
    promptExcerpt: 'Rotate, tilt, and tune hanging 3D windbells so teal gust ribbons ring Blue, Amber, and Silver note sequences before the storm meter fills.',
    screenshotUrl: '/kaze/screenshot.png',
    generationDuration: 'manual subagent run with timeout recovery ~140 minutes',
    generatedAt: '2026-06-19T01:31:46Z'
  },
  11: {
    status: 'generated',
    title: 'Hana Kimono Pattern Weaver',
    slug: 'hana-kimono-pattern-weaver',
    genre: ['pattern-placement puzzle', 'textile atelier arcade', 'mobile-first 2D'],
    mode: '2d',
    description: 'Fulfill spring kimono workshop commissions by stamping, rotating, and flipping sakura, wave, crane, plum, and gold-thread motifs onto a shaped cloth panel before the dye dries.',
    objective: 'Complete Sakura Lining, Crane Sleeve, and Festival Obi while reaching 2600 points to trigger Hana Grand Fitting, then continue into endless custom commissions.',
    playUrl: '/hana/',
    promptUrl: '/hana/prompt.html',
    promptExcerpt: 'Stamp kimono motifs, preserve mirrored sleeve symmetry, repair dye smudges, stop silk moths, and finish each textile commission before the dye tray dries.',
    screenshotUrl: '/hana/screenshot.png',
    generationDuration: 'manual controller run with implementation/asset subagents ~150 minutes',
    generatedAt: '2026-06-21T01:44:28Z'
  },
  12: {
    status: 'generated',
    title: 'Yuki Snow Lantern Stacksmith',
    slug: 'yuki-snow-lantern-stacksmith',
    genre: ['3D stacking arcade', 'balance-crafting', 'mobile-first score chase'],
    mode: '3d',
    description: 'Build carved 3D snow lanterns in a quiet winter shrine courtyard by rotating, shifting, dropping, venting, and shielding chunky snow blocks around a candle core.',
    objective: 'Complete First Snow Base, Fox Path Window, and Shrine Dawn Spire while reaching 2800 points to trigger Yuki Grand Illumination, then continue into endless lantern commissions.',
    playUrl: '/yuki/',
    promptUrl: '/yuki/prompt.html',
    promptExcerpt: 'Stack 3D snow blocks around a candle, keep the plumb line centered, carve vents, face fox windows correctly, and shield winter gusts.',
    screenshotUrl: '/yuki/screenshot.png',
    generationDuration: 'manual subagent run with existing generated assets ~120 minutes',
    generatedAt: '2026-06-23T01:37:47Z'
  },
  13: {
    status: 'generated',
    title: 'Ame Parasol Puddle Conductor',
    slug: 'ame-parasol-puddle-conductor',
    genre: ['hybrid shelter-management arcade', 'rain-procession timing', 'mobile-first score chase'],
    mode: 'hybrid',
    description: 'Conduct a rainy shrine-market procession by moving and tilting paper parasols, keeping guests dry, opening puddle reflection stepping-stones, and deflecting rain curtains into gutters.',
    objective: 'Complete Market Drizzle, Red Bridge Crossing, and Lantern Downpour while reaching 2700 points to trigger Ame Moonlit Procession, then continue into endless rainy-night commissions.',
    playUrl: '/ame/',
    promptUrl: '/ame/prompt.html',
    promptExcerpt: 'Move and tilt wagasa parasols across layered shrine paths, shelter guests from rain curtains, open puddle reflections, and charge Thunder Drum.',
    screenshotUrl: '/ame/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation subagent ~130 minutes',
    generatedAt: '2026-06-24T01:38:28Z'
  },
  14: {
    status: 'generated',
    title: 'Kiri Origami Foldwright',
    slug: 'kiri-origami-foldwright',
    genre: ['hybrid origami puzzle', 'paper-layer route planning', 'mobile-first score chase'],
    mode: 'hybrid',
    description: 'Fold translucent washi paper into mountain ridges and valley troughs, preview the crane route, collect vermilion ink seals, reinforce weak grain, and reach ceremony gates before the sheet tears.',
    objective: 'Complete First Crease, Cedar Bridge, and Dawn Crane Flight while reaching 2800 points to trigger Kiri Thousand-Fold Blessing, then continue into endless folding commissions.',
    playUrl: '/kiri/',
    promptUrl: '/kiri/prompt.html',
    promptExcerpt: 'Tap crease lines, choose Mountain or Valley folds, preview the origami crane path, collect ink seals, and manage tear stress before launching toward the ceremony gate.',
    screenshotUrl: '/kiri/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-06-25T01:31:37Z'
  },
  15: {
    status: 'generated',
    title: 'Midori Bamboo Canal Keeper',
    slug: 'midori-bamboo-canal-keeper',
    genre: ['water-routing puzzle arcade', 'bamboo irrigation', 'mobile-first 2D'],
    mode: '2d',
    description: 'Rotate and lock carved bamboo canals in a lush morning grove, pulse spring water into requested basins, collect koi beads, patch sun cracks, and beat drought pressure.',
    objective: 'Complete Dew Gate, Frog Basin, and Sunlit Grove while reaching 2900 points to trigger Midori Full-Grove Bloom, then continue into endless irrigation commissions.',
    playUrl: '/midori/',
    promptUrl: '/midori/prompt.html',
    promptExcerpt: 'Rotate bamboo canal pieces, lock clean routes, pulse spring water, fill moss basins and lotus bowls, patch sun cracks, and keep overflow/drought under control.',
    screenshotUrl: '/midori/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-06-26T01:31:29Z'
  },
  16: {
    status: 'generated',
    title: 'Ryu Ember Kiln Potter',
    slug: 'ryu-ember-kiln-potter',
    genre: ['3D pottery wheel sculpting', 'kiln heat management', 'mobile-first score chase'],
    mode: '3d',
    description: 'Shape a spinning clay vessel in a warm mountain pottery studio, tune profile rings against ghost silhouettes, carve dragon scales, brush ash-blue glaze, and fire the piece in a glowing dragon kiln without cracks.',
    objective: 'Complete Tea Bowl Foot, Incense Cup Lip, and Dragon Kiln Vase while reaching 3000 points to trigger Ryu Ember Offering, then continue into endless kiln commissions.',
    playUrl: '/ryu/',
    promptUrl: '/ryu/prompt.html',
    promptExcerpt: 'Select 3D clay rings, widen or narrow the vessel profile, smooth wobble, carve and glaze the requested bands, then manage Bellows and Vent heat during firing.',
    screenshotUrl: '/ryu/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-06-27T01:38:42Z'
  },
  17: {
    status: 'generated',
    title: 'Kumo Silverweb Starcatcher',
    slug: 'kumo-silverweb-starcatcher',
    genre: ['spatial silk-web tension puzzle', 'star-catching arcade', 'mobile-first hybrid'],
    mode: 'hybrid',
    description: 'Weave silver silk strands between moonlit shrine-canopy anchors, tune tension and depth layers, pluck held dew-stars into lantern cups, and mend moth-frayed web before the night thins.',
    objective: 'Complete First Dew Net, Cedar Moon Bridge, and Starfall Festival while reaching 3100 points to trigger Kumo Moonweb Constellation, then continue into endless night commissions.',
    playUrl: '/kumo/',
    promptUrl: '/kumo/prompt.html',
    promptExcerpt: 'Select anchor knots, weave near/mid/far silver strands, tune tight/slack tension, pluck held dew-stars, fill lantern cups, and keep moon-moths from fraying the web.',
    screenshotUrl: '/kumo/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-06-28T01:31:12Z'
  },
  18: {
    status: 'generated',
    title: 'Asa Daruma Wishwheel Labyrinth',
    slug: 'asa-daruma-wishwheel-labyrinth',
    genre: ['3D tilt labyrinth', 'momentum routing', 'mobile-first score chase'],
    mode: '3d',
    description: 'Tilt a dawn shrine maze board so a friendly daruma wishwheel collects ema plaques, opens torii gates, rings bells, avoids sumi ink, and reaches the offering bowl.',
    objective: 'Complete First Wish Roll, Torii Bridge Turn, and Sunrise Bell Offering while reaching 3200 points to trigger Asa Dawn Wish Fulfilled, then continue into endless shrine boards.',
    playUrl: '/asa/',
    promptUrl: '/asa/prompt.html',
    promptExcerpt: 'Tilt the shrine board, collect matching ema plaques, open torii gates, ring dawn bells, brake before ink pools, and roll the daruma into the offering bowl.',
    screenshotUrl: '/asa/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-06-29T01:38:54Z'
  },
  19: {
    status: 'generated',
    title: 'Matsuri Taiko Lanternline Maestro',
    slug: 'matsuri-taiko-lanternline-maestro',
    genre: ['rhythm-routing arcade', 'festival timing', 'mobile-first 2D'],
    mode: '2d',
    description: 'Conduct a blue-hour matsuri parade by striking big taiko pads in time, opening lantern gates, routing carriers, and repeating call-and-response phrases toward a Grand Encore.',
    objective: 'Complete Opening Don, Fox-Mask Call, and Firework Finale while reaching 3300 points to trigger Matsuri Grand Encore, then continue into endless festival patterns.',
    playUrl: '/matsuri/',
    promptUrl: '/matsuri/prompt.html',
    promptExcerpt: 'Hit Don, Ka, Hi, and Ya cues on the beat, route lantern carriers through matching gates, use Festival Focus, and repeat call echoes for the Grand Encore.',
    screenshotUrl: '/matsuri/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-06-30T01:42:13Z'
  },
  20: {
    status: 'generated',
    title: 'Umi Pearl Kelp Cartographer',
    slug: 'umi-pearl-kelp-cartographer',
    genre: ['3D underwater navigation', 'oxygen-routing arcade', 'mobile-first score chase'],
    mode: '3d',
    description: 'Dive through a luminous kelp canyon, collect requested pearl beacons, drop guide-shell markers in calm eddies, refill oxygen at air bells, dodge moon jellyfish, and complete the Umi Pearl Atlas.',
    objective: 'Complete Shallow Shell Path, Kelp Torii Channel, and Moon-Jelly Trench while reaching 3400 points to trigger Umi Pearl Atlas, then continue into endless dive commissions.',
    playUrl: '/umi/',
    promptUrl: '/umi/prompt.html',
    promptExcerpt: 'Steer a tiny ama-diver through 3D depth, collect pearls in order, manage oxygen at air bells, place guide shells, and use Sonar Bloom to reveal hidden beacons.',
    screenshotUrl: '/umi/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-02T01:40:22Z'
  },
  21: {
    status: 'generated',
    title: 'Aki Karesansui Ripplekeeper',
    slug: 'aki-karesansui-ripplekeeper',
    genre: ['hybrid zen-garden routing puzzle', 'sand-ripple arcade', 'mobile-first score chase'],
    mode: 'hybrid',
    description: 'Rake calm karesansui sand ripples, rotate standing stones, and guide autumn maple leaves into moon-view basins while preserving moss islands and garden harmony.',
    objective: 'Complete First Rake Circle, Crane Stone Crossing, and Moon Basin Reflection while reaching 3500 points to trigger Aki Golden Stillness, then continue into endless garden commissions.',
    playUrl: '/aki/',
    promptUrl: '/aki/prompt.html',
    promptExcerpt: 'Rake directional sand ripples, bend leaf routes with standing stones, preserve moss islands, and use Tamp Sand, Basin Bell, and Still Garden to complete autumn dry-garden commissions.',
    screenshotUrl: '/aki/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-03T02:20:00Z'
  },
  22: {
    status: 'generated',
    title: 'Hoshi Nebuta Kite Cartographer',
    slug: 'hoshi-nebuta-kite-cartographer',
    genre: ['3D kite-thread navigation', 'constellation tracing arcade', 'mobile-first score chase'],
    mode: '3d',
    description: 'Steer a glowing nebuta-paper kite through layered night winds, collect ordered star-ink nodes, manage braided-thread tension, place star-thread markers, and light shrine beacons to complete the Hoshi Sky Map.',
    objective: 'Complete First Star Thread, Cloud Shelf Crossing, and Nebuta Dawn Map while reaching 3600 points to trigger Hoshi Sky Map Complete, then continue into endless kite commissions.',
    playUrl: '/hoshi/',
    promptUrl: '/hoshi/prompt.html',
    promptExcerpt: 'Steer a luminous kite through 3D sky depth, reel thread tension in/out, collect stars in order, place star-thread markers, and use Kitsune Gust to reveal hidden routes.',
    screenshotUrl: '/hoshi/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-04T01:55:00Z'
  },
  23: {
    status: 'generated',
    title: 'Sumi Ink Seal Scribe',
    slug: 'sumi-ink-seal-scribe',
    genre: ['brush-stroke precision arcade', 'calligraphy pressure puzzle', 'mobile-first 2D'],
    mode: '2d',
    description: 'Trace smoky sumi brush strokes across moonlit washi cards, manage ink wetness, prevent spreading blots, and finish each commission with a clean vermilion seal.',
    objective: 'Complete First Moon Stroke, Crane Poem Margin, and Vermilion Festival Scroll while reaching 3700 points to trigger Sumi Master Seal, then continue into endless scroll commissions.',
    playUrl: '/sumi/',
    promptUrl: '/sumi/prompt.html',
    promptExcerpt: 'Draw calligraphy strokes in order, balance Fine and Loaded Brush wetness, rescue blots with Rice Paper Dab, stamp the Hanko Seal, and use Calm Breath for clean scrolls.',
    screenshotUrl: '/sumi/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-05T01:35:48Z'
  },
  24: {
    status: 'generated',
    title: 'Usagi Mochi Moon Hopper',
    slug: 'usagi-mochi-moon-hopper',
    genre: ['3D hop-platform arcade', 'moon-mochi timing', 'mobile-first score chase'],
    mode: '3d',
    description: 'Hop a tiny moon rabbit across springy 3D mochi pads above a lantern-lit rooftop festival, collect ordered rice sparks, brace wobbling pads, dash through tray gates, and deliver glowing offerings to moon trays.',
    objective: 'Complete First Mooncake Hop, Lantern Tray Crossing, and Jade Rabbit Offering while reaching 3800 points to trigger Usagi Moon Feast, then continue into endless rooftop commissions.',
    playUrl: '/usagi/',
    promptUrl: '/usagi/prompt.html',
    promptExcerpt: 'Aim and charge moon-rabbit hops across springy 3D mochi pads, collect rice sparks in order, stabilize cracked pads, and deliver glowing trays before soot-bat shadows cross the route.',
    screenshotUrl: '/usagi/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-06T01:40:05Z'
  },
  25: {
    status: 'generated',
    title: 'Neko Koban Bell Cascade',
    slug: 'neko-koban-bell-cascade',
    genre: ['luck-physics arcade', 'pachinko routing', 'mobile-first 2D'],
    mode: '2d',
    description: 'Drop glossy koban coins through a cozy maneki-neko fortune cabinet, rotate cat-paw bumpers, toggle charm gates, ring bells, and bank requested coins into matching trays before luck runs out.',
    objective: 'Complete First Paw Chime, Lantern Coin Spiral, and Golden Maneki Offering while reaching 3900 points to trigger Neko Grand Fortune, then continue into endless fortune commissions.',
    playUrl: '/neko/',
    promptUrl: '/neko/prompt.html',
    promptExcerpt: 'Choose drop slots, rotate paw bumpers, toggle charm gates, ring Fortune Bell, nudge carefully, and guide koban coins into requested lucky trays.',
    screenshotUrl: '/neko/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-07T01:51:08Z'
  },
  26: {
    status: 'generated',
    title: 'Natsu Hanabi Sky Painter',
    slug: 'natsu-hanabi-sky-painter',
    genre: ['3D firework trajectory painting', 'timing-and-altitude arcade', 'mobile-first score chase'],
    mode: '3d',
    description: 'Aim lacquer hanabi launch tubes over a summer river festival, charge shell arcs through 3D sky rings, time altitude/depth bursts, clear smoke with Wind Fan, and complete colorful fireworks commissions.',
    objective: 'Complete First River Spark, Lantern Bridge Bloom, and Grand Summer Crest while reaching 4000 points to trigger Natsu Grand Hanabi, then continue into endless sky-painting commissions.',
    playUrl: '/natsu/',
    promptUrl: '/natsu/prompt.html',
    promptExcerpt: 'Aim in 3D, charge hanabi shells through sky rings, pick fuse timing and shell color, then burst at the requested altitude/depth while managing smoke.',
    screenshotUrl: '/natsu/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-08T01:43:34Z'
  },
  27: {
    status: 'generated',
    title: 'Haru Matcha Whisk Atelier',
    slug: 'haru-matcha-whisk-atelier',
    genre: ['circular motion arcade', 'foam-pattern precision', 'mobile-first 2D'],
    mode: '2d',
    description: 'Whisk spring matcha in a bright tea-room atelier, build fine foam, steer bubbles into crest patterns, skim powder clumps, manage temperature and bitterness, and serve perfect usucha bowls.',
    objective: 'Complete First Spring Froth, Sakura Guest Bowl, and Garden Ceremony Crest while reaching 4100 points to trigger Haru Perfect Usucha, then continue into endless tea commissions.',
    playUrl: '/haru/',
    promptUrl: '/haru/prompt.html',
    promptExcerpt: 'Whisk matcha foam into requested spring crests, manage temperature and bitterness, skim clumps, use Tea Focus, and serve the bowl cleanly.',
    screenshotUrl: '/haru/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-09T01:42:41Z'
  },
  28: {
    status: 'generated',
    title: 'Akane Foxfire Shrine Sentinel',
    slug: 'akane-foxfire-shrine-sentinel',
    genre: ['3D stealth-routing', 'foxfire escort', 'mobile-first score chase'],
    mode: '3d',
    description: 'Guide a kitsune sentinel through an akane-dusk Inari shrine, escort blue foxfire wisps through torii lanes, light lanterns in order, and dodge shadow-yokai sight cones.',
    objective: 'Complete First Torii Spark, Cedar Stair Procession, and Akane Grand Vigil while reaching 4200 points, then continue into endless dusk patrol commissions.',
    playUrl: '/akane/',
    promptUrl: '/akane/prompt.html',
    promptExcerpt: 'Escort foxfire wisps through a 3D shrine, light ordered lanterns, hide in warm pools, distract patrol cones with Suzu Bell, and use Moon Veil to preview safe routes.',
    screenshotUrl: '/akane/screenshot.png',
    generationDuration: 'manual controller recovery with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-10T01:58:14Z'
  },
  29: {
    status: 'generated',
    title: 'Hinoki Kumiko Screenwright',
    slug: 'hinoki-kumiko-screenwright',
    genre: ['tactile woodworking puzzle', 'kumiko lattice placement', 'mobile-first 2D'],
    mode: '2d',
    description: 'Craft warm hinoki kumiko shoji panels by dry-fitting lattice strips, trimming notches, clamping clean joints, planing burrs, and keeping grain stress from cracking the screen.',
    objective: 'Complete First Asa-no-ha Panel, Sakura Hex Screen, and Festival Shoji Masterwork while reaching 4300 points to trigger Hinoki Master Screen, then continue into endless custom lattice commissions.',
    playUrl: '/hinoki/',
    promptUrl: '/hinoki/prompt.html',
    promptExcerpt: 'Fit hinoki strips to kumiko blueprints, rotate and dry-fit pieces, trim notches, clamp clean joints, plane burrs, and use Calm Measure before grain stress cracks the shoji panel.',
    screenshotUrl: '/hinoki/screenshot.png',
    generationDuration: 'manual controller recovery with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-11T01:53:45Z'
  },
  30: {
    status: 'generated',
    title: 'Mikan Sunwheel Orchard',
    slug: 'mikan-sunwheel-orchard',
    genre: ['3D orchard-harvest routing', 'ripeness sorting', 'mobile-first score chase'],
    mode: '3d',
    description: 'Orbit a bamboo picker basket through a sunny 3D mikan orchard canopy, pluck fruit at golden ripeness, sort clean catches into crates, and manage sunwheel, hornets, wind, leaf nets, and bruising pressure.',
    objective: 'Complete First Sunny Basket, Terrace Crate Rush, and Golden Sunwheel Harvest while reaching 4400 points to trigger Mikan Grand Harvest, then continue into endless orchard commissions.',
    playUrl: '/mikan/',
    promptUrl: '/mikan/prompt.html',
    promptExcerpt: 'Orbit, raise, and lower a basket through a 3D mikan tree, pluck golden fruit, sort crate lanes, shoo hornets, and use Sunwheel/Leaf Net/Harvest Focus to save the harvest.',
    screenshotUrl: '/mikan/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-12T01:45:00Z'
  },
  31: {
    status: 'generated',
    title: 'Botan Ikebana Balance Atelier',
    slug: 'botan-ikebana-balance-atelier',
    genre: ['floral balance puzzle', 'ikebana composition', 'mobile-first 2D'],
    mode: '2d',
    description: 'Create calm ikebana arrangements by anchoring stems into a brass kenzan, balancing peony weight, preserving moon-shaped negative space, misting thirsty blooms, and using Ma Focus to preview composition lines.',
    objective: 'Complete First Peony Line, Moon Bowl Triangle, and Festival Botan Masterwork while reaching 4500 points to trigger Botan Grand Arrangement, then continue into endless floral commissions.',
    playUrl: '/botan/',
    promptUrl: '/botan/prompt.html',
    promptExcerpt: 'Anchor stems, rotate and trim previews, preserve empty space, manage vase tilt and freshness, mist blooms, tie heavy branches, and use Ma Focus for balance lines.',
    screenshotUrl: '/botan/screenshot.png',
    generationDuration: 'manual controller run with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-13T01:44:43Z'
  },
  32: {
    status: 'generated',
    title: 'Onsen Steamline Bathkeeper',
    slug: 'onsen-steamline-bathkeeper',
    genre: ['3D thermal-routing puzzle', 'steam-valve management', 'mobile-first score chase'],
    mode: '3d',
    description: 'Tune a cozy mountain onsen by rotating copper valves through near, mid, and far duct lanes, balancing hot steam, cool mist, pressure vents, bamboo spouts, and macaque guest comfort.',
    objective: 'Complete First Cedar Soak, Moonstone Mineral Loop, and Snow-Monkey Dawn Bath while reaching 4600 points to trigger Onsen Grand Yuge, then continue into endless bathhouse commissions.',
    playUrl: '/onsen/',
    promptUrl: '/onsen/prompt.html',
    promptExcerpt: 'Route hot steam and cool mist through 3D onsen ducts, tune pool temperatures, vent pressure, soothe macaque guests, and use Yuge Focus before fog overloads the bathhouse.',
    screenshotUrl: '/onsen/screenshot.png',
    generationDuration: 'manual controller recovery with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-14T01:32:09Z'
  },
  33: {
    status: 'generated',
    title: 'Uchiwa Fan Dye Maestro',
    slug: 'uchiwa-fan-dye-maestro',
    genre: ['radial pattern puzzle', 'paper-fan dye routing', 'mobile-first 2D'],
    mode: '2d',
    description: 'Dye a summer festival uchiwa fan by aligning stencil masks, brushing indigo/coral/saffron pigment, preserving white breeze gaps, folding edges, blotting bleed, and fan-drying clean washi sectors.',
    objective: 'Complete First Indigo Breeze, Goldfish Festival Arc, and Night-Market Firefly Fan while reaching 4700 points to trigger Uchiwa Grand Breeze, then continue into endless fan commissions.',
    playUrl: '/uchiwa/',
    promptUrl: '/uchiwa/prompt.html',
    promptExcerpt: 'Select fan sectors, rotate stencil motifs, brush pigments, fold paper edges, blot bleed, fan-dry clean lines, and use Kaze-Dry Focus to preview safe dye paths.',
    screenshotUrl: '/uchiwa/screenshot.png',
    generationDuration: 'manual controller recovery with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-15T01:47:54Z'
  },
  34: {
    status: 'generated',
    title: 'Temari Thread Orbit Weaver',
    slug: 'temari-thread-orbit-weaver',
    genre: ['3D spherical embroidery puzzle', 'silk-thread tension routing', 'mobile-first score chase'],
    mode: '3d',
    description: 'Rotate a lacquered 3D temari ball, set pearl start/end pins, wrap colored silk along curved orbit arcs, tune tension, lock intersections, and complete geometric pattern cards before tangle frays the thread.',
    objective: 'Complete First Star Wrap, Kagome Lantern Lattice, and Moon Festival Temari while reaching 4800 points to trigger Temari Grand Orbit, then continue into endless pattern commissions.',
    playUrl: '/temari/',
    promptUrl: '/temari/prompt.html',
    promptExcerpt: 'Wrap silk around a 3D temari sphere, tune safe tension, lock pearl intersections, avoid tangles, and use Kagome Focus to preview hidden arcs.',
    screenshotUrl: '/temari/screenshot.png',
    generationDuration: 'manual controller recovery with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-16T01:35:30Z'
  },
  35: {
    status: 'generated',
    title: 'Hashi Tanuki Bridgewright',
    slug: 'hashi-tanuki-bridgewright',
    genre: ['bridge-building physics puzzle', 'river-load testing', 'mobile-first 2D'],
    mode: '2d',
    description: 'Build bamboo-and-rope bridges across a dusk mountain stream, test them with tanuki lantern porters, manage budget, stress, current, repairs, and Survey Focus load-path previews.',
    objective: 'Complete First Creek Span, Red Gorge Lantern Run, and Moon Shrine Load Test while reaching 4900 points to trigger Hashi Grand Crossing, then continue into endless bridge contracts.',
    playUrl: '/hashi/',
    promptUrl: '/hashi/prompt.html',
    promptExcerpt: 'Select bridge nodes, place bamboo beams, rope braces, and stone piers, then test tanuki lantern porters while managing stress, budget, current, repair timing, and Survey Focus.',
    screenshotUrl: '/hashi/screenshot.png',
    generationDuration: 'manual controller recovery with Imagegen2 assets and implementation/QA subagents ~150 minutes',
    generatedAt: '2026-07-17T01:31:41Z'
  }
};

const generatedEntries = Object.entries(generatedGames)
  .map(([day, game]) => ({ day: Number(day), date: generatedDate(game) }))
  .filter((entry): entry is { day: number; date: string } => Boolean(entry.date))
  .sort((a, b) => a.day - b.day);

const latestGeneratedEntry = generatedEntries.at(-1);
const nextUpcomingBase = latestGeneratedEntry
  ? new Date(`${latestGeneratedEntry.date}T00:00:00Z`)
  : new Date(`${START_DATE}T00:00:00Z`);
const nextUpcomingDay = latestGeneratedEntry ? latestGeneratedEntry.day : 1;

function scheduledDate(day: number, generated: Partial<GameCard> | undefined): string {
  const actualGeneratedDate = generatedDate(generated);
  if (actualGeneratedDate) return actualGeneratedDate;
  return isoDate(addDays(nextUpcomingBase, day - nextUpcomingDay));
}

export const games: GameCard[] = Array.from({ length: 100 }, (_, index) => {
  const day = index + 1;
  const generated = generatedGames[day];
  return {
    day,
    date: scheduledDate(day, generated),
    status: generated?.status ?? 'upcoming',
    title: generated?.title ?? `Day ${day.toString().padStart(3, '0')}`,
    description: generated?.description ?? 'Not generated yet. The nightly agent will create exactly one detailed prompt and one self-contained game for this day.',
    generationDuration: generated?.generationDuration,
    ...generated
  };
});
