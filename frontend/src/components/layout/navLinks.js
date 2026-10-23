// All links point at sections of the home page (`/#id`).
export const trekInfoLinks = [
  { to: '/#itinerary', label: 'Day-wise Itinerary' },
  { to: '/#departures', label: 'Departures & Pricing' },
  { to: '/#inclusions', label: 'Inclusions & Exclusions' },
  { to: '/#pickup-drop', label: 'Pickup & Drop' },
  { to: '/#difficulty', label: 'Difficulty & Fitness' },
  { to: '/#things-to-carry', label: 'Things to Carry' },
  { to: '/#best-time', label: 'Best Time to Visit' },
  { to: '/#faqs', label: 'FAQs' },
  { to: '/#reviews', label: 'Reviews' },
]

export const mainLinks = [
  { to: '/', label: 'Home' },
  { label: 'Treks', children: trekInfoLinks },
  { to: '/#about', label: 'About' },
  { to: '/#gallery', label: 'Gallery' },
  { to: '/#contact', label: 'Contact' },
]
