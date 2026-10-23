import { request } from '../../lib/apiClient'

const reviews = {
  rating: 4.9,
  count: 500,
  items: [
    {
      id: 1,
      name: 'AMIR ELAYYAN',
      role: 'GREAT EXPERIENCE!',
      location: 'Dubai, UAE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      stars: 5,
      headline: 'TRUSTED BY TRAVELERS WHO RETURN',
      text: 'Planning a trek to Kedarkantha was something I always thought would be a logistical nightmare, until I booked with Treki Travels. They handled everything: research, gear planning, warm homestays, campsite permits, and high-altitude food. The trek leaders felt like family and made standing at 12,500 ft unforgettable!',
    },
    {
      id: 2,
      name: 'PRIYA SHARMA',
      role: 'SUMMIT CONQUERED!',
      location: 'Bengaluru, India',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      stars: 5,
      headline: 'AN UNREAL WINTER WONDERLAND',
      text: 'Watching the sunrise over Swargarohini and Bandarpoonch peaks from the Kedarkantha summit was the most magical morning of my life. The team paced us perfectly, provided hot delicious meals in sub-zero temperatures, and made every step safe and enjoyable.',
    },
    {
      id: 3,
      name: 'RAHUL & ANANYA',
      role: 'FIRST TIME TREKKERS',
      location: 'Mumbai, India',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      stars: 5,
      headline: 'FLAWLESS EXECUTION & MEMORIES',
      text: 'As beginners, we had so many doubts about the snow and cold. The certified guides checked our oxygen levels twice daily, coached us through frozen trails, and made camp nights beside Juda Ka Talab full of laughter and stargazing. 10/10 recommendation!',
    },
    {
      id: 4,
      name: 'DAVID MORGAN',
      role: 'EXCELLENT EXPEDITION',
      location: 'London, UK',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
      stars: 5,
      headline: 'HIMALAYAN HOSPITALITY AT ITS FINEST',
      text: 'Having trekked in the Alps and Andes, the warmth and professionalism of this team truly stands out. Pristine snow, spotless camps, eco-conscious trail ethics, and unforgettable panoramic summits. Already planning our return trip for Har Ki Dun.',
    },
  ],
}

export const getReviews = () => request('/reviews', { mock: () => reviews })
