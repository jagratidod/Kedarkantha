import {
  Clock, Route, Mountain, Gauge, Home, IndianRupee, Tent, Utensils, UserCheck, Backpack,
  FileText, HeartPulse, Users, ShieldCheck, Receipt, Smile, ShieldAlert, Leaf, Heart, User,
  Footprints, Shirt, Hand, Glasses, GlassWater, Pill, Flashlight, Candy, Camera, Sun,
  Snowflake, CircleHelp, Activity, Wind,
} from 'lucide-react'

const MAP = {
  clock: Clock, route: Route, mountain: Mountain, gauge: Gauge, home: Home, rupee: IndianRupee,
  tent: Tent, utensils: Utensils, guide: UserCheck, backpack: Backpack, permit: FileText,
  firstaid: HeartPulse, team: Users, shield: ShieldCheck, receipt: Receipt, smile: Smile,
  safety: ShieldAlert, leaf: Leaf, heart: Heart, user: User, shoe: Footprints, jacket: Wind,
  shirt: Shirt, glove: Hand, glasses: Glasses, bottle: GlassWater, pill: Pill, torch: Flashlight,
  pole: Activity, snack: Candy, camera: Camera, sun: Sun, sock: Snowflake,
}

export default function Icon({ name, size = 20, className = '', ...rest }) {
  const Cmp = MAP[name] || CircleHelp
  return <Cmp size={size} className={className} aria-hidden="true" {...rest} />
}
