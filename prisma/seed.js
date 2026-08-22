const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cities = [
  { name: 'New Delhi', country: 'India', slug: 'new-delhi-india', lat: 28.6139, lon: 77.2090, description: 'Capital city with historic sites like Red Fort and India Gate.' },
  { name: 'Ahmedabad', country: 'India', slug: 'ahmedabad-india', lat: 23.0225, lon: 72.5714, description: 'Largest city in Gujarat, known for heritage, food, and vibrant local culture.' },
  { name: 'Mehsana', country: 'India', slug: 'mehsana-india', lat: 23.6000, lon: 72.4000, description: 'Historic city in north Gujarat with a strong regional heritage and easy access to tourist routes.' },
  { name: 'Mumbai', country: 'India', slug: 'mumbai-india', lat: 19.0760, lon: 72.8777, description: 'Coastal megacity known for Bollywood and the Gateway of India.' },
  { name: 'Bengaluru', country: 'India', slug: 'bengaluru-india', lat: 12.9716, lon: 77.5946, description: 'Tech hub with parks, cafes and vibrant nightlife.' },
  { name: 'Jaipur', country: 'India', slug: 'jaipur-india', lat: 26.9124, lon: 75.7873, description: 'Pink City famous for palaces, forts, and Rajasthani culture.' },
  { name: 'Goa', country: 'India', slug: 'goa-india', lat: 15.2993, lon: 74.1240, description: 'Popular beach destination with nightlife and water sports.' },

  { name: 'Paris', country: 'France', slug: 'paris-france', lat: 48.8566, lon: 2.3522, description: 'Romantic capital with world-class museums and cuisine.' },
  { name: 'London', country: 'United Kingdom', slug: 'london-uk', lat: 51.5074, lon: -0.1278, description: 'Historic and modern attractions including museums and theatres.' },
  { name: 'Tokyo', country: 'Japan', slug: 'tokyo-japan', lat: 35.6895, lon: 139.6917, description: 'High-tech metropolis with temples, shopping districts and food culture.' },
  { name: 'New York', country: 'USA', slug: 'new-york-usa', lat: 40.7128, lon: -74.0060, description: 'Bustling city with iconic landmarks like Central Park and Times Square.' },
  { name: 'Sydney', country: 'Australia', slug: 'sydney-australia', lat: -33.8688, lon: 151.2093, description: 'Harbour city known for the Opera House and beautiful beaches.' },
];

const activitiesBySlug = {
  'new-delhi-india': [
    { name: 'Red Fort tour', description: 'Guided visit to the 17th-century Red Fort.', durationMins: 90, price: 10.0 },
    { name: 'Street food walk in Old Delhi', description: 'Taste local favorites like chaat and paratha.', durationMins: 120, price: 20.0 },
    { name: 'Qutub Minar visit', description: 'Explore the UNESCO site and surrounding complex.', durationMins: 60, price: 8.0 },
  ],
  'ahmedabad-india': [
    { name: 'Sabarmati Riverfront walk', description: 'Evening walk along the riverfront with local street food.', durationMins: 90, price: 0.0 },
    { name: 'Adalaj Stepwell visit', description: 'Explore the historic stepwell architecture.', durationMins: 75, price: 8.0 },
    { name: 'Gujarat craft market tour', description: 'Browse local textiles, handicrafts, and folk art.', durationMins: 120, price: 12.0 },
  ],
  'mehsana-india': [
    { name: 'Mehsana heritage trail', description: 'Explore local heritage points and cultural highlights.', durationMins: 90, price: 5.0 },
    { name: 'Regional food tasting', description: 'Taste Gujarati snacks and local delicacies.', durationMins: 60, price: 10.0 },
    { name: 'Sunset viewpoint visit', description: 'Relaxing scenic evening stop with local atmosphere.', durationMins: 60, price: 0.0 },
  ],
  'mumbai-india': [
    { name: 'Gateway of India & Boat Ride', description: 'Boat trip to see the Gateway and Marine Drive.', durationMins: 90, price: 15.0 },
    { name: 'Bollywood studio tour', description: 'Behind-the-scenes look at Bollywood sets.', durationMins: 180, price: 40.0 },
    { name: 'Crawford Market food crawl', description: 'Local markets and street-food tasting.', durationMins: 120, price: 18.0 },
  ],
  'bengaluru-india': [
    { name: 'Cubbon Park morning walk', description: 'Relaxing walk and local flora.', durationMins: 60, price: 0.0 },
    { name: 'IT campus cycling tour', description: 'Explore the tech hubs by bike.', durationMins: 120, price: 12.0 },
    { name: 'Bangalore Palace visit', description: 'Tour the historic Bangalore Palace.', durationMins: 90, price: 10.0 },
  ],
  'jaipur-india': [
    { name: 'Amber Fort visit', description: 'Elephant ride or jeep up to the fort and a guided tour.', durationMins: 120, price: 25.0 },
    { name: 'City Palace and Jantar Mantar', description: 'Historic palace complex and observatory.', durationMins: 120, price: 12.0 },
    { name: 'Rajasthani cooking class', description: 'Hands-on local cuisine experience.', durationMins: 180, price: 30.0 },
  ],
  'goa-india': [
    { name: 'Beach day at Baga', description: 'Sunbathing, parasailing and beach shacks.', durationMins: 240, price: 0.0 },
    { name: 'Old Goa heritage tour', description: 'Churches and colonial architecture tour.', durationMins: 120, price: 8.0 },
    { name: 'Island boat trip', description: 'Day trip to nearby islands and snorkeling.', durationMins: 360, price: 45.0 },
  ],

  'paris-france': [
    { name: 'Eiffel Tower visit', description: 'Skip-the-line ticket to the Eiffel Tower.', durationMins: 90, price: 25.0 },
    { name: 'Louvre highlights tour', description: 'Guided tour of major artworks.', durationMins: 150, price: 30.0 },
    { name: 'Seine river cruise', description: 'Evening sightseeing cruise.', durationMins: 60, price: 20.0 },
  ],
  'london-uk': [
    { name: 'Tower of London & Crown Jewels', description: 'Historic fortress tour.', durationMins: 120, price: 28.0 },
    { name: 'West End theatre show', description: 'Ticket booking for popular shows.', durationMins: 180, price: 50.0 },
    { name: 'Thames river cruise', description: 'Sightseeing on the Thames.', durationMins: 60, price: 18.0 },
  ],
  'tokyo-japan': [
    { name: 'Tsukiji market & sushi tasting', description: 'Fresh sushi tasting and market tour.', durationMins: 120, price: 35.0 },
    { name: 'Asakusa and Senso-ji temple', description: 'Historic temple and Nakamise street.', durationMins: 90, price: 0.0 },
    { name: 'Shibuya crossing experience', description: 'Explore Shibuya and nearby shopping.', durationMins: 120, price: 0.0 },
  ],
  'new-york-usa': [
    { name: 'Statue of Liberty & Ellis Island', description: 'Ferry and guided tour.', durationMins: 180, price: 30.0 },
    { name: 'Central Park bike tour', description: 'Guided cycle around Central Park.', durationMins: 90, price: 20.0 },
    { name: 'Broadway show ticket', description: 'Popular Broadway musical or play.', durationMins: 180, price: 80.0 },
  ],
  'sydney-australia': [
    { name: 'Sydney Opera House tour', description: 'Backstage tours and guided visit.', durationMins: 90, price: 35.0 },
    { name: 'Bondi to Coogee coastal walk', description: 'Scenic coastal walk with beaches.', durationMins: 180, price: 0.0 },
    { name: 'Harbour Bridge climb', description: 'Climb experience with views.', durationMins: 240, price: 150.0 },
  ],
};

async function main() {
  console.log('Starting seed...');

  const cityMap = {};

  for (const c of cities) {
    // Upsert city by slug (slug is unique)
    let city = await prisma.city.findUnique({ where: { slug: c.slug } });
    if (!city) {
      city = await prisma.city.create({ data: c });
      console.log(`Created city ${c.name}`);
    } else {
      city = await prisma.city.update({ where: { id: city.id }, data: c });
      console.log(`Updated city ${c.name}`);
    }
    cityMap[c.slug] = city.id;

    // Seed activities for this city
    const acts = activitiesBySlug[c.slug] || [];
    for (const a of acts) {
      const existing = await prisma.activity.findFirst({ where: { cityId: city.id, name: a.name } });
      if (!existing) {
        await prisma.activity.create({ data: { ...a, cityId: city.id } });
        console.log(`  Created activity '${a.name}' for ${c.name}`);
      } else {
        await prisma.activity.update({ where: { id: existing.id }, data: { ...a, cityId: city.id } });
        console.log(`  Updated activity '${a.name}' for ${c.name}`);
      }
    }
  }

  const totalCities = await prisma.city.count();
  const totalActivities = await prisma.activity.count();

  console.log(`Seeding complete. Cities: ${totalCities}, Activities: ${totalActivities}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
