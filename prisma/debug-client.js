const { PrismaClient } = require('@prisma/client');
(async function(){
  const p = new PrismaClient();
  console.log('Client keys:', Object.keys(p));
  // show if city model exists
  console.log('Has city:', typeof p.city !== 'undefined');
  await p.$disconnect();
})();
