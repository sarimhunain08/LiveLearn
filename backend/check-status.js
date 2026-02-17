require('dotenv').config();
const mongoose = require('mongoose');
const Class = require('./models/Class');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Check scheduled classes
  const scheduled = await Class.find({ status: 'scheduled' }).select('title date time classDateTime timezone duration status').lean();
  console.log('Scheduled classes:', scheduled.length);
  scheduled.forEach(c => {
    console.log(`  "${c.title}" | time=${c.time} | classDateTime=${c.classDateTime} | tz=${c.timezone} | status=${c.status}`);
  });
  
  // Run auto-update
  const updated = await Class.autoUpdateStatuses();
  console.log('\nAuto-update result:', updated, 'classes updated');
  
  // Check again
  const afterUpdate = await Class.find({ status: 'scheduled' }).select('title classDateTime status').lean();
  console.log('Still scheduled after update:', afterUpdate.length);
  afterUpdate.forEach(c => {
    console.log(`  "${c.title}" | classDateTime=${c.classDateTime}`);
  });
  
  await mongoose.disconnect();
}

check().catch(console.error);
