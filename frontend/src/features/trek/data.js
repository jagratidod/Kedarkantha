// Mock content. Every `image: null` falls back to the default photo (see lib/images.js).
// Shapes mirror what the future admin API will return.

export const trek = {
  name: 'Kedarkantha Trek',
  tagline: 'Where Snow Meets Serenity',
  intro:
    'Experience the magic of the Himalayas with Treki Travels. Snowy trails, pine forests, and unforgettable summit views.',
  description:
    'Kedarkantha is one of the most popular winter treks in India, known for its snow-covered trails, dense pine forests, and breathtaking views from the summit. Perfect for both beginners and experienced trekkers, this trek offers a complete Himalayan experience.',
  stats: [
    { icon: 'clock', value: '5-6 Days', label: 'Duration' },
    { icon: 'route', value: '20 km', label: 'Total Distance' },
    { icon: 'mountain', value: '12,500 ft', label: 'Max Altitude' },
    { icon: 'gauge', value: 'Easy-Moderate', label: 'Difficulty' },
    { icon: 'home', value: 'Sankri', label: 'Base Camp' },
    { icon: 'rupee', value: '₹7,999', label: 'Starting Price' },
  ],
  image: null,
}

export const highlights = [
  {
    id: 1,
    title: 'KEDARKANTHA SUMMIT',
    subtitle: 'Golden Sunrise at 12,500 ft',
    caption: 'Stunning 360° Himalayan views',
    tag: 'Summit Day',
    description: 'Stand atop the 12,500 ft crest as dawn casts golden alpenglow across Swargarohini, Bandarpoonch, and Black Peak in a breathtaking 360-degree panorama.',
    image: null,
    focus: '50% 30%',
  },
  {
    id: 2,
    title: 'SNOW COVERED TRAILS',
    subtitle: 'Dense Oak & Pine Canopies',
    caption: 'Fresh alpine snowway',
    tag: 'Winter Trail',
    description: 'Trek through knee-deep winter powder sheltered by centuries-old pines and mossy oaks, where sunlight filters through snow-laden cedar branches.',
    image: null,
    focus: '15% 60%',
  },
  {
    id: 3,
    title: 'JUDA KA TALAB',
    subtitle: 'High Altitude Frozen Lake',
    caption: 'Camp beneath the starry sky',
    tag: 'Alpine Lake',
    description: 'A mystical alpine lake locked in thick shimmering ice, ringed by giant pine trees and dramatic snow banks at 9,100 ft.',
    image: null,
    focus: '55% 85%',
  },
  {
    id: 4,
    title: 'BASE CAMP MEADOWS',
    subtitle: 'Stargazing Under Milky Way',
    caption: 'Sub-zero expedition camps',
    tag: 'Base Camp',
    description: 'Camp in insulated high-altitude alpine tents under crystal-clear Himalayan night skies with billions of stars and glowing snow ridges.',
    image: null,
    focus: '85% 40%',
  },
  {
    id: 5,
    title: 'SWARGAROHINI PANORAMA',
    subtitle: 'Stairway to Heaven Peaks',
    caption: 'Sacred Garhwal Massifs',
    tag: 'Mountain Vista',
    description: 'Marvel at legendary snow-draped massifs stretching into Tibet, bathed in early morning purple hues and golden mountain ridges.',
    image: null,
    focus: '70% 35%',
  },
]

// Journey-map stops (placeholder destinations - edit freely / replace via the admin API later).
// `pos` places the card on the map stage in % of its width/height (desktop layout).
export const journeys = [
  { id: 1, name: 'Kedarkantha', region: 'India', to: '/#itinerary', image: null, focus: '50% 40%', pos: { left: 75, top: 39, width: 20 } },
  { id: 2, name: 'Switzerland', region: 'Europe', to: '/#departures', image: null, focus: '60% 35%', pos: { left: 29.3, top: 46, width: 21.6 } },
  { id: 3, name: 'Patagonia', region: 'South America', to: '/#departures', image: null, focus: '20% 60%', pos: { left: 4, top: 74.5, width: 16.3 } },
]

export const itinerary = [
  { day: 1, title: 'Dehradun to Sankri', meta: 'Drive: 200 km • 8-9 hrs', image: '/daybyday/dehraduntosankari.png', text: 'Early morning pickup from Dehradun. A scenic drive through Mussoorie, Purola and Mori along the Yamuna and Tons valleys brings you to the village of Sankri, where you settle in and meet your trek leader.', focus: '50% 50%' },
  { day: 2, title: 'Sankri to Juda Ka Talab', meta: 'Trek: 4 km • 4-5 hrs', image: '/daybyday/judakatalab.png', text: 'A gentle climb through oak and pine forest leads to the frozen Juda Ka Talab lake, surrounded by snow and tall pines. Camp beside the lake for the night.', focus: '50% 50%' },
  { day: 3, title: 'Juda Ka Talab to Base Camp', meta: 'Trek: 4 km • 4-5 hrs', image: '/daybyday/basecamp.png', text: 'Continue up a snowy ridge with open meadows and wide Himalayan views. Reach Kedarkantha Base Camp by afternoon and rest for the summit push.', focus: '50% 50%' },
  { day: 4, title: 'Summit Day', meta: 'Trek: 6 km • 6-7 hrs', image: '/daybyday/kedarkantha.png', text: 'Start before dawn for the summit at 12,500 ft. Watch the sunrise over a 360° panorama of Swargarohini, Bandarpoonch and Black Peak, then descend back to camp.', focus: '50% 50%' },
  { day: 5, title: 'Base Camp to Sankri', meta: 'Trek: 6 km • 5-6 hrs', image: '/daybyday/step5.png', text: 'A long descent through snow-laden forests back to Sankri. Celebrate the summit with a hot meal and a warm night in the village.', focus: '50% 50%' },
  { day: 6, title: 'Sankri to Dehradun', meta: 'Drive: 200 km • 8-9 hrs', image: '/daybyday/step6.png', text: 'Drive back to Dehradun, arriving by evening. Goodbyes, group photos and plans for the next adventure.', focus: '50% 50%' },
]

export const departureFeatures = [
  { icon: 'tent', title: 'Accommodation', text: 'Camps & Tents' },
  { icon: 'utensils', title: 'Meals', text: 'All Meals' },
  { icon: 'guide', title: 'Expert Guides', text: 'Certified Team' },
  { icon: 'backpack', title: 'Basic Equipment', text: 'Tents, Sleeping Bags' },
  { icon: 'permit', title: 'Permits', text: 'Forest Permits' },
  { icon: 'firstaid', title: 'First Aid', text: 'Safety Equipment' },
]

export const galleryCategories = ['All', 'Summit', 'Trails', 'Campsites', 'Groups', 'Scenery']

// Heights make the masonry look like the mock; category drives the filter chips.
export const gallery = [
  // Summit
  { id: 1, category: 'Summit', title: 'Golden Sunrise at 12,500 ft', tall: true, focus: '68% 30%' },
  { id: 2, category: 'Summit', title: 'Swargarohini Peak View', tall: false, focus: '90% 20%' },
  { id: 3, category: 'Summit', title: 'Kedarkantha Summit Crest', tall: true, focus: '50% 25%' },
  { id: 4, category: 'Summit', title: 'Pre-Dawn Summit Ridge', tall: false, focus: '30% 45%' },
  { id: 5, category: 'Summit', title: 'Himalayan 360 Panorama', tall: false, focus: '75% 40%' },
  { id: 6, category: 'Summit', title: 'Summit Prayer Flags', tall: true, focus: '40% 60%' },
  { id: 7, category: 'Summit', title: 'Alpenglow on Bandarpoonch', tall: false, focus: '60% 15%' },
  { id: 8, category: 'Summit', title: 'Resting at the Summit Cairn', tall: false, focus: '45% 70%' },
  { id: 9, category: 'Summit', title: 'Morning Light over Snow Peaks', tall: true, focus: '85% 35%' },
  { id: 10, category: 'Summit', title: 'Final Ridge Ascent', tall: false, focus: '20% 50%' },
  { id: 11, category: 'Summit', title: 'Above the Sea of Clouds', tall: false, focus: '55% 20%' },

  // Trails
  { id: 12, category: 'Trails', title: 'Pine Forest Snow Trail', tall: false, focus: '10% 60%' },
  { id: 13, category: 'Trails', title: 'Winding Oak Trail in Winter', tall: true, focus: '25% 55%' },
  { id: 14, category: 'Trails', title: 'Crisp Footsteps in Fresh Powder', tall: false, focus: '40% 65%' },
  { id: 15, category: 'Trails', title: 'Sunbeams Through the Cedar Trees', tall: true, focus: '35% 30%' },
  { id: 16, category: 'Trails', title: 'Ascending Towards Juda Ka Talab', tall: false, focus: '60% 45%' },
  { id: 17, category: 'Trails', title: 'Frozen Stream Crossing', tall: false, focus: '15% 75%' },
  { id: 18, category: 'Trails', title: 'Winter Forest Trailway', tall: true, focus: '70% 60%' },
  { id: 19, category: 'Trails', title: 'Trail Guide Leading the Pack', tall: false, focus: '50% 40%' },
  { id: 20, category: 'Trails', title: 'Snowy Forest Canopy', tall: false, focus: '80% 25%' },
  { id: 21, category: 'Trails', title: 'Sunlit Ridge Path', tall: false, focus: '30% 35%' },

  // Campsites
  { id: 22, category: 'Campsites', title: 'Juda Ka Talab Lake Camp', tall: false, focus: '80% 75%' },
  { id: 23, category: 'Campsites', title: 'Kedarkantha Base Camp Tents', tall: false, focus: '60% 65%' },
  { id: 24, category: 'Campsites', title: 'Campfire Under the Milky Way', tall: true, focus: '50% 50%' },
  { id: 25, category: 'Campsites', title: 'Morning Frost on Expedition Tents', tall: false, focus: '35% 80%' },
  { id: 26, category: 'Campsites', title: 'Warm Tea in the Dining Tent', tall: true, focus: '45% 65%' },
  { id: 27, category: 'Campsites', title: 'Sunset at Base Camp Meadow', tall: false, focus: '70% 45%' },
  { id: 28, category: 'Campsites', title: 'Snow Enclosed Alpine Camp', tall: false, focus: '25% 70%' },
  { id: 29, category: 'Campsites', title: 'Evening Glow at Camp', tall: true, focus: '85% 60%' },
  { id: 30, category: 'Campsites', title: 'Tent Circle in the Clearing', tall: false, focus: '15% 55%' },

  // Groups
  { id: 31, category: 'Groups', title: 'Summit Celebration Group', tall: false, focus: '40% 70%' },
  { id: 32, category: 'Groups', title: 'Trek Buddies at Base Camp', tall: false, focus: '50% 90%' },
  { id: 33, category: 'Groups', title: 'Trail High-Fives', tall: true, focus: '35% 55%' },
  { id: 34, category: 'Groups', title: 'Campfire Laughter & Stories', tall: false, focus: '60% 80%' },
  { id: 35, category: 'Groups', title: 'Trek Crew Snow Fight', tall: true, focus: '45% 45%' },
  { id: 36, category: 'Groups', title: 'Fellow Trekkers at Ridge Point', tall: false, focus: '70% 65%' },
  { id: 37, category: 'Groups', title: 'Morning Team Briefing', tall: false, focus: '25% 50%' },
  { id: 38, category: 'Groups', title: 'Sankri Homestay Welcome Team', tall: true, focus: '55% 75%' },
  { id: 39, category: 'Groups', title: 'Victory Flag Raising at Summit', tall: false, focus: '80% 50%' },

  // Scenery
  { id: 40, category: 'Scenery', title: 'Pristine Himalayan Vista', tall: true, focus: '55% 30%' },
  { id: 41, category: 'Scenery', title: 'Frozen Juda Ka Talab Waters', tall: false, focus: '35% 40%' },
  { id: 42, category: 'Scenery', title: 'Golden Hour Across the Valley', tall: true, focus: '65% 25%' },
  { id: 43, category: 'Scenery', title: 'Dramatic Snow Formations', tall: false, focus: '20% 45%' },
  { id: 44, category: 'Scenery', title: 'Stargazing in the Himalayas', tall: false, focus: '75% 60%' },
  { id: 45, category: 'Scenery', title: 'Endless Pine Forest Horizon', tall: true, focus: '40% 35%' },
  { id: 46, category: 'Scenery', title: 'Rolling Clouds Below the Peak', tall: false, focus: '85% 20%' },
  { id: 47, category: 'Scenery', title: 'Winter Sun Shining Through Snow', tall: false, focus: '50% 15%' },
  { id: 48, category: 'Scenery', title: 'Evening Crimson Skies', tall: false, focus: '60% 50%' },
].map((g) => ({ ...g, image: null }))

export const about = {
  story:
    'Treki Travels was founded with a simple vision - to make Himalayan adventures accessible, safe and memorable for everyone. We are a team of passionate mountaineers, nature lovers and travel enthusiasts who believe in responsible tourism and creating meaningful experiences.',
  mission:
    'To inspire people to explore the beauty of Himalayas while promoting responsible tourism and environmental conservation.',
  pillars: [
    { icon: 'team', title: 'Experienced Team', text: 'Certified Guides' },
    { icon: 'shield', title: 'Safe & Responsible', text: 'Your Safety First' },
    { icon: 'receipt', title: 'Transparent Pricing', text: 'No Hidden Costs' },
    { icon: 'smile', title: 'Memorable Experiences', text: 'Small Groups' },
  ],
  values: [
    { icon: 'safety', title: 'Safety', text: 'Always' },
    { icon: 'leaf', title: 'Sustainability', text: 'Eco-friendly' },
    { icon: 'heart', title: 'Community', text: 'Support Local' },
    { icon: 'user', title: 'Authenticity', text: 'Real Experiences' },
  ],
}

export const inclusions = {
  included: [
    'Accommodation in camps/tents',
    'All meals during trek',
    'Certified trek leader and guides',
    'Forest permits and entry fees',
    'Basic trekking equipment',
    'First aid and safety equipment',
  ],
  excluded: [
    'Travel to and from Dehradun',
    'Personal expenses (snacks, etc.)',
    'Insurance',
    'Trekking shoes and personal gear',
    'Any additional costs due to weather',
    'GST (if applicable)',
  ],
}

export const pickup = {
  points: [
    { name: 'Dehradun Railway Station', time: '6:00 AM' },
    { name: 'Dehradun ISBT', time: '6:30 AM' },
    { name: 'Jolly Grant Airport', time: '7:00 AM' },
  ],
  drop: [
    'Return drop to same locations',
    'Expected arrival: 6:00 PM - 8:00 PM',
    '(Subject to road and weather conditions)',
  ],
}

export const difficulty = {
  level: 'Easy - Moderate',
  score: 2, // out of 5 bars
  fitness: [
    'Basic cardiovascular fitness',
    'Able to walk 5-6 hours daily',
    'No prior trekking experience required',
    'Recommended age: 12-55 years',
  ],
}

export const thingsToCarry = {
  mandatory: [
    { icon: 'shoe', text: 'Trekking shoes (waterproof)' },
    { icon: 'jacket', text: 'Warm jackets (down/woollen)' },
    { icon: 'shirt', text: 'Thermal wear (upper & lower)' },
    { icon: 'glove', text: 'Gloves, cap, muffler' },
    { icon: 'glasses', text: 'Sunglasses (UV protection)' },
    { icon: 'bottle', text: 'Water bottle (1L)' },
    { icon: 'pill', text: 'Personal medications' },
    { icon: 'backpack', text: 'Backpack (40-50L)' },
  ],
  optional: [
    { icon: 'torch', text: 'Headlamp / torch' },
    { icon: 'pole', text: 'Trekking poles' },
    { icon: 'snack', text: 'Energy bars & dry fruits' },
    { icon: 'camera', text: 'Camera / power bank' },
    { icon: 'sock', text: 'Extra woollen socks' },
    { icon: 'sun', text: 'Sunscreen & lip balm' },
  ],
}

export const bestTime = {
  seasons: [
    { months: 'December - February', note: 'Best for snow', temp: 'Temperature: -9°C to 10°C', focus: '50% 30%' },
    { months: 'March - April', note: 'Clear views', temp: 'Temperature: -5°C to 15°C', focus: '80% 40%' },
    { months: 'November', note: 'Less crowd', temp: 'Temperature: 0°C to 10°C', focus: '20% 60%' },
  ],
  disclaimer: 'Note: Snowfall is subject to weather conditions and cannot be guaranteed on specific dates.',
}

export const faqs = [
  { q: 'What is the best time for Kedarkantha trek?', a: 'December to February is best for deep snow; March and April offer clearer views with lighter snow. November is quieter with the first snowfall.' },
  { q: 'Is this trek suitable for beginners?', a: 'Yes. It is rated easy-moderate and needs no prior trekking experience, only basic fitness and the will to walk 5-6 hours a day.' },
  { q: 'What is the age limit?', a: 'We recommend 12 to 55 years. Younger or older trekkers should consult us before booking.' },
  { q: 'What about snowfall?', a: 'Snow is likely from December to March but is weather dependent. The trail is beautiful with or without fresh snow.' },
  { q: 'Is there mobile network?', a: 'Sankri has limited coverage. Beyond it there is no reliable network, so inform family before the trek.' },
  { q: 'What happens in case of bad weather?', a: 'Safety comes first. Your trek leader may delay, shorten or reroute the trek. Weather-related changes may involve extra costs.' },
  { q: 'What is the cancellation policy?', a: 'Cancel 15+ days before departure for a 90% refund, 7-14 days for 50%, and under 7 days no refund. Dates can be transferred once, free of charge.' },
  { q: 'Can I do this trek solo?', a: 'Absolutely. Most of our groups are made up of solo travellers who become friends on the trail.' },
]
