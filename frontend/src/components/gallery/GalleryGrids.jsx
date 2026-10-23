import { useState } from 'react'
import { RotateCw, Compass } from 'lucide-react'
import Img from '../ui/Img'

/**
 * Interactive 3D Photo Tile:
 * - HOVER: Inner image smoothly spins 360 degrees.
 * - CLICK: Card flips 3D from right to left (180deg) to reveal the back side with proper heading, altitude & story.
 */
export function GridTile({ photo, index = 0, label = '', className = '', style = {}, aspect = '' }) {
  const [flipped, setFlipped] = useState(false)
  const title = photo?.title || label || `Kedarkantha Moment ${index + 1}`
  const category = photo?.category || 'Kedarkantha'

  return (
    <div
      style={style}
      className={`group relative select-none [perspective:1000px] cursor-pointer ${aspect} ${className}`}
      onClick={() => setFlipped((prev) => !prev)}
      title="Click to flip card"
    >
      {/* 3D Flipping Card Container */}
      <div
        className={`relative h-full w-full rounded-md shadow-sm transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(-180deg)] shadow-2xl' : 'hover:shadow-xl'
        }`}
      >
        {/* ================= FRONT SIDE ================= */}
        <div className="absolute inset-0 h-full w-full overflow-hidden rounded-md bg-[#232F26] [backface-visibility:hidden]">
          {/* Image with smooth hover zoom */}
          <div className="h-full w-full overflow-hidden">
            <Img
              image={photo?.image}
              focus={photo?.focus || '50% 50%'}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 cubic-bezier(0.25,1,0.5,1) group-hover:scale-115"
            />
          </div>

          {/* Front title overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-1.5 sm:p-2 text-center opacity-85 transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-[10px] sm:text-xs font-medium tracking-wide text-white/95 line-clamp-1">
              {title}
            </p>
          </div>

          {/* Small 3D Flip Hint Icon on top right */}
          <div className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <RotateCw size={12} className="animate-spin-slow" />
          </div>
        </div>

        {/* ================= BACK SIDE (Revealed upon click flip) ================= */}
        <div className="absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden rounded-md border border-[#445A4B] bg-[#16221A] p-2.5 sm:p-3.5 text-white [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-inner">
          {/* Top Tag & Flip indicator */}
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#B5D4BF]">
              <Compass size={11} className="text-emerald-400" /> {category}
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-white/50">
              Flip Back ↻
            </span>
          </div>

          {/* Proper Heading & Description */}
          <div className="my-auto py-1 text-center">
            <h4 className="font-display text-xs sm:text-sm md:text-base font-semibold uppercase leading-snug tracking-wide text-white line-clamp-2">
              {title}
            </h4>
            <div className="mx-auto my-1.5 h-px w-8 bg-emerald-500/40" />
            <p className="text-[9px] sm:text-[11px] leading-relaxed text-[#C5D5CB] line-clamp-3">
              Spectacular high-altitude winter vista overlooking the Garhwal Himalayas at 12,500 ft elevation.
            </p>
          </div>

          {/* Bottom Footer Details */}
          <div className="flex items-center justify-between pt-1 text-[8px] sm:text-[10px] text-white/60 border-t border-white/10">
            <span>Kedarkantha</span>
            <span className="font-mono text-emerald-400">12,500 FT</span>
          </div>
        </div>

      </div>
    </div>
  )
}

/* =========================================================================
   EXACT "FAMILY" CENTER HERO MOSAIC (From User's Latest 2nd Reference)
   
   Structure:
   - CENTERPIECE: Massive horizontal rectangle photo (Aspect ~16:10 or 4:3)
   - DIRECTLY UNDER CENTERPIECE: Horizontal full-width banner ("FAMILY" / "SCENERY")
   - DIRECTLY BELOW BANNER: 2 horizontal landscape blocks + 1 small square
   - DIRECTLY ABOVE CENTERPIECE: 1 horizontal block (left) + 1 large tall peak block (right)
   - LEFT WING:
     - Upper-left square
     - Far-left protruding horizontal rectangle
     - Lower-left square
     - Bottom-left small angled companion
   - RIGHT WING:
     - Upper-right square
     - Middle-right square
     - Far-right protruding horizontal rectangle
   ========================================================================= */
export function ExactFamilyMosaicGrid({ items = [], centerTitle = 'SCENERY' }) {
  const p = items || []

  return (
    <div className="mx-auto w-full max-w-5xl px-2 sm:px-4">
      {/* 4-column master structure matching the schematic precisely */}
      <div className="grid grid-cols-12 gap-2.5 sm:gap-3.5 items-center">
        
        {/* LEFT COLUMN WING (Span 3) */}
        <div className="col-span-3 flex flex-col gap-2.5 sm:gap-3.5">
          <div className="self-end w-4/5">
            <GridTile photo={p[0]} index={0} label="Ridge View" aspect="aspect-[4/3]" />
          </div>
          <GridTile photo={p[1]} index={1} label="Valley Overlook" aspect="aspect-[16/10]" className="shadow-md" />
          <div className="self-end w-5/6">
            <GridTile photo={p[2]} index={2} label="Pine Forest" aspect="aspect-square" />
          </div>
          <div className="self-end w-3/4">
            <GridTile photo={p[3]} index={3} label="Alpine Snow" aspect="aspect-[4/3]" />
          </div>
        </div>

        {/* CENTER MAIN STACK (Span 6) - Matches Center Crown, Giant Hero, and FAMILY Banner */}
        <div className="col-span-6 flex flex-col gap-2.5 sm:gap-3.5">
          {/* Top Crown above Hero (Left horizontal block + Right peak block) */}
          <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 items-end">
            <div className="col-span-2">
              <GridTile photo={p[4]} index={4} label="Morning Light" aspect="aspect-[16/10]" />
            </div>
            <div className="col-span-3">
              <GridTile photo={p[5]} index={5} label="Highest Summit Ridge" aspect="aspect-[16/9]" className="shadow-lg" />
            </div>
          </div>

          {/* GIANT CENTRAL HERO PHOTO (Dominant focus of the layout) */}
          <GridTile
            photo={p[6]}
            index={6}
            label="Kedarkantha Himalayan Vista"
            aspect="aspect-[16/10]"
            className="ring-2 ring-forest/20 shadow-2xl"
          />

          {/* THE "FAMILY" / "SCENERY" BANNER (Directly underneath the giant hero) */}
          <div className="flex w-full items-center justify-center rounded-md border border-line bg-white/95 py-2.5 sm:py-3.5 text-center shadow-sm">
            <span className="font-display text-sm sm:text-lg md:text-xl font-bold uppercase tracking-[0.35em] text-forest">
              {centerTitle}
            </span>
          </div>

          {/* Bottom Footing under Banner (2 horizontal landscape blocks) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
            <GridTile photo={p[7]} index={7} label="Base Camp Meadow" aspect="aspect-[16/10]" />
            <GridTile photo={p[8]} index={8} label="Frozen Juda Lake" aspect="aspect-[16/10]" />
          </div>
        </div>

        {/* RIGHT COLUMN WING (Span 3) */}
        <div className="col-span-3 flex flex-col gap-2.5 sm:gap-3.5">
          <div className="self-start w-3/4">
            <GridTile photo={p[9]} index={9} label="East Peak" aspect="aspect-[4/3]" />
          </div>
          <div className="self-start w-5/6">
            <GridTile photo={p[10]} index={10} label="Sunset Clouds" aspect="aspect-square" />
          </div>
          <GridTile photo={p[11]} index={11} label="Cedar Trail" aspect="aspect-[16/10]" className="shadow-md" />
          <div className="self-start w-3/4">
            <GridTile photo={p[12]} index={12} label="Sankri Village" aspect="aspect-[4/3]" />
          </div>
        </div>

      </div>
    </div>
  )
}

/* =========================================================================
   EXACT "YOUR TEXT" CENTER OVAL MOSAIC GRID (From User's Latest Screenshot)
   
   Structure:
   5 distinct vertical columns (Col 1 to Col 5)
   
   1. Col 1 (Outer Left Wing):
      - Upper horizontal rectangle
      - Center horizontal rectangle
      - Lower horizontal rectangle
      
   2. Col 2 (Mid-Left Column):
      - Top square
      - Middle square
      - Bottom tall vertical block
      
   3. Col 3 (Center Anchor Column):
      - Top tallest vertical hero block (peaks above all columns)
      - CENTER BANNER: "YOUR TEXT" / "KEDARKANTHA TREK" white rectangular banner with bold typography
      - Bottom tall vertical hero block (descends below all columns)
      
   4. Col 4 (Mid-Right Column):
      - Top tall vertical block
      - Middle horizontal rectangle
      - Bottom square
      
   5. Col 5 (Outer Right Wing):
      - Top square
      - Center horizontal rectangle
      - Bottom horizontal rectangle
   ========================================================================= */
export function ExactCenterTextMosaicGrid({ items = [], centerTitle = 'KEDARKANTHA' }) {
  const p = items || []

  return (
    <div className="mx-auto w-full max-w-5xl px-2 sm:px-4">
      {/* 5-Column Grid with tight, crisp gaps matching the user's reference diagram */}
      <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 items-center">
        
        {/* COLUMN 1: Outer Left (3 horizontal rectangles) */}
        <div className="col-start-1 flex flex-col gap-2.5 sm:gap-3.5">
          <GridTile photo={p[0]} index={0} label="West Ridge" aspect="aspect-[16/10]" />
          <GridTile photo={p[1]} index={1} label="Summit Ascent" aspect="aspect-[16/10]" />
          <GridTile photo={p[2]} index={2} label="Pine Valley" aspect="aspect-[16/10]" />
        </div>

        {/* COLUMN 2: Mid-Left (Top square, middle square, bottom tall block) */}
        <div className="col-start-2 flex flex-col gap-2.5 sm:gap-3.5">
          <GridTile photo={p[3]} index={3} label="Alpine Meadow" aspect="aspect-square" />
          <GridTile photo={p[4]} index={4} label="Lake Juda" aspect="aspect-square" />
          <GridTile photo={p[5]} index={5} label="Snow Trail" aspect="aspect-[3/4]" />
        </div>

        {/* COLUMN 3: Center Column (Top tall peak, CENTER TEXT BANNER, Bottom tall anchor) */}
        <div className="col-start-3 flex flex-col gap-2.5 sm:gap-3.5">
          {/* Top Tallest Vertical Peak */}
          <GridTile
            photo={p[6]}
            index={6}
            label="Highest Summit Crest"
            aspect="aspect-[3/4]"
            className="ring-1 ring-forest/20 shadow-md"
          />

          {/* CENTER "YOUR TEXT" BANNER */}
          <div className="flex aspect-[16/7] w-full items-center justify-center rounded-md border border-line bg-white/95 px-3 py-4 text-center shadow-sm">
            <span className="font-display text-xs sm:text-base md:text-xl font-bold uppercase tracking-[0.25em] text-forest">
              {centerTitle}
            </span>
          </div>

          {/* Bottom Tallest Vertical Anchor */}
          <GridTile
            photo={p[7]}
            index={7}
            label="Base Camp Meadow"
            aspect="aspect-[3/4]"
            className="ring-1 ring-forest/20 shadow-md"
          />
        </div>

        {/* COLUMN 4: Mid-Right (Top tall block, middle horizontal, bottom square) */}
        <div className="col-start-4 flex flex-col gap-2.5 sm:gap-3.5">
          <GridTile photo={p[8]} index={8} label="Swargarohini Peak" aspect="aspect-[3/4]" />
          <GridTile photo={p[9]} index={9} label="Ridge Walk" aspect="aspect-[16/10]" />
          <GridTile photo={p[10]} index={10} label="Sunset Camp" aspect="aspect-square" />
        </div>

        {/* COLUMN 5: Outer Right (Top square, center horizontal, bottom horizontal) */}
        <div className="col-start-5 flex flex-col gap-2.5 sm:gap-3.5">
          <GridTile photo={p[11]} index={11} label="Morning Clouds" aspect="aspect-square" />
          <GridTile photo={p[12]} index={12} label="Trekker Overlook" aspect="aspect-[16/10]" />
          <GridTile photo={p[13]} index={13} label="Cedar Forest" aspect="aspect-[16/10]" />
        </div>

      </div>
    </div>
  )
}

/* =========================================================================
   ASYMMETRIC STEPPED ARCH (Screenshot 4)
   ========================================================================= */
export function AsymmetricSteppedArchGrid({ items = [] }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-2 sm:px-4">
      <div className="grid grid-cols-4 gap-2.5 items-center">
        {/* Column 1 */}
        <div className="flex flex-col gap-2.5">
          <div className="h-10 sm:h-16" aria-hidden="true" />
          <GridTile photo={items[0]} index={0} label="Summit View" aspect="aspect-[16/9]" />
          <GridTile photo={items[1]} index={1} label="Rocky Pass" aspect="aspect-square" />
          <div className="h-6 sm:h-12" aria-hidden="true" />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-2.5">
          <GridTile photo={items[2]} index={2} label="Ridge Line" aspect="aspect-[16/10]" />
          <GridTile photo={items[3]} index={3} label="Summit Ridge" aspect="aspect-[3/5]" className="shadow-md" />
          <GridTile photo={items[4]} index={4} label="Prayer Flags" aspect="aspect-square" />
        </div>

        {/* Column 3 (Peak Column - Tallest Top & Lowest Bottom) */}
        <div className="flex flex-col gap-2.5">
          <GridTile photo={items[5]} index={5} label="Swargarohini" aspect="aspect-[3/4]" className="shadow-lg" />
          <GridTile photo={items[6]} index={6} label="Highest Crest" aspect="aspect-square" className="ring-1 ring-forest/20" />
          <GridTile photo={items[7]} index={7} label="Final Climb" aspect="aspect-[3/4]" />
        </div>

        {/* Column 4 */}
        <div className="flex flex-col gap-2.5">
          <div className="h-4 sm:h-8" aria-hidden="true" />
          <GridTile photo={items[8]} index={8} label="Alpenglow" aspect="aspect-[16/11]" />
          <GridTile photo={items[9]} index={9} label="Himalayan Panorama" aspect="aspect-[16/10]" />
          <GridTile photo={items[10]} index={10} label="Descent Trail" aspect="aspect-[16/9]" />
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   SCATTERED COLOR GRID (Screenshot 2)
   ========================================================================= */
export function ScatteredColorGrid({ items = [] }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-2 sm:px-4">
      {/* Top Floating Color Blocks + Ambient Photos */}
      <div className="flex items-end justify-center gap-3 pb-3">
        <div className="h-8 w-8 sm:h-12 sm:w-12 rounded bg-[#F8E8D5]" />
        <div className="h-8 w-8 sm:h-12 sm:w-12 rounded bg-[#E4DDF2]" />
        <div className="w-24 sm:w-36">
          <GridTile photo={items[0]} index={0} label="Coastal Breeze" aspect="aspect-[4/3]" />
        </div>
        <div className="h-7 w-7 sm:h-10 sm:w-10 rounded bg-[#D3E2E6]" />
        <div className="w-24 sm:w-36">
          <GridTile photo={items[1]} index={1} label="Glacier Path" aspect="aspect-[4/3]" />
        </div>
        <div className="h-8 w-8 sm:h-12 sm:w-12 rounded bg-[#E2F1E4]" />
      </div>

      {/* Main Horizontal Band */}
      <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
        <div className="col-span-2 flex flex-col gap-2 sm:gap-3">
          <GridTile photo={items[2]} index={2} label="Summit Horizon" aspect="aspect-square" />
          <GridTile photo={items[3]} index={3} label="Snow Trekker" aspect="aspect-square" />
        </div>

        <div className="col-span-3">
          <GridTile photo={items[4]} index={4} label="Luggage & Departure" aspect="aspect-[3/4]" className="shadow-lg" />
        </div>

        <div className="col-span-2 flex flex-col gap-2 sm:gap-3">
          <GridTile photo={items[5]} index={5} label="Group Smiles" aspect="aspect-[4/3]" />
          <GridTile photo={items[6]} index={6} label="Ocean Viewers" aspect="aspect-[4/3]" />
        </div>

        <div className="col-span-3">
          <GridTile photo={items[7]} index={7} label="Canal Gondola" aspect="aspect-[4/3]" className="shadow-lg" />
        </div>

        <div className="col-span-2 flex flex-col gap-2 sm:gap-3">
          <GridTile photo={items[8]} index={8} label="Winter Coat" aspect="aspect-square" />
          <GridTile photo={items[9]} index={9} label="Overlook" aspect="aspect-square" />
        </div>
      </div>

      {/* Bottom Floating Color Blocks + Ambient Photos */}
      <div className="flex items-start justify-center gap-3 pt-3">
        <div className="h-8 w-8 sm:h-12 sm:w-12 rounded bg-[#F8E8D5]" />
        <div className="h-8 w-8 sm:h-12 sm:w-12 rounded bg-[#D3E6DC]" />
        <div className="w-24 sm:w-36">
          <GridTile photo={items[10]} index={10} label="Lake Duo" aspect="aspect-[4/3]" />
        </div>
        <div className="h-7 w-7 sm:h-10 sm:w-10 rounded bg-[#E4DDF2]" />
        <div className="w-24 sm:w-36">
          <GridTile photo={items[11]} index={11} label="Desert Ride" aspect="aspect-[4/3]" />
        </div>
        <div className="h-8 w-8 sm:h-12 sm:w-12 rounded bg-[#F5E2CE]" />
      </div>
    </div>
  )
}

/* =========================================================================
   EDITORIAL REAL ESTATE GRID (Screenshot 3)
   ========================================================================= */
export function EditorialRealEstateGrid({ items = [] }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-2 sm:px-4">
      <div className="grid grid-cols-12 gap-3 items-start">
        {/* Left Column (Hero block + lower companion) */}
        <div className="col-span-4 flex flex-col gap-3">
          <GridTile photo={items[0]} index={0} label="Terrace Sunset Lodge" aspect="aspect-[16/10]" />
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded bg-[#C4A88E]/30 p-3 flex items-center justify-center text-center font-display text-xs uppercase tracking-wider text-forest font-semibold border border-[#C4A88E]/40">
              CAMP RETREAT
            </div>
            <GridTile photo={items[1]} index={1} label="Pine Courtyard" aspect="aspect-square" />
          </div>
        </div>

        {/* Center-Left Column */}
        <div className="col-span-3 flex flex-col gap-3">
          <GridTile photo={items[2]} index={2} label="Forest Villas" aspect="aspect-[16/10]" />
          <GridTile photo={items[3]} index={3} label="Alpine Pavilions" aspect="aspect-square" />
        </div>

        {/* Center-Right Column */}
        <div className="col-span-3 flex flex-col gap-3">
          <GridTile photo={items[4]} index={4} label="Night Lights at Camp" aspect="aspect-[3/4]" />
          <GridTile photo={items[5]} index={5} label="Plaza Gathering" aspect="aspect-[16/10]" />
        </div>

        {/* Far Right Column */}
        <div className="col-span-2 flex flex-col gap-3">
          <GridTile photo={items[6]} index={6} label="Tall Pines" aspect="aspect-[3/4]" />
          <div className="h-16 w-full rounded bg-[#BE9E82] shadow-sm flex items-center justify-center text-[10px] text-white font-medium uppercase tracking-widest">
            TREKI
          </div>
          <GridTile photo={items[7]} index={7} label="Lodge Walkway" aspect="aspect-square" />
          <div className="h-12 w-full rounded bg-[#C9B29B]/50" />
        </div>
      </div>
    </div>
  )
}
