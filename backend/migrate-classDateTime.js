require('dotenv').config();
const mongoose = require('mongoose');
const Class = require('./models/Class');

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  const classes = await Class.find({ classDateTime: { $exists: false } }).select('date time timezone title');
  console.log('Classes to migrate:', classes.length);

  for (const cls of classes) {
    const dateStr = cls.date.toISOString().split('T')[0];
    const timeStr = cls.time || '00:00';
    // Existing classes were created by teacher in Pakistan, treat time as PKT (UTC+5)
    const localStr = dateStr + 'T' + timeStr + ':00+05:00';
    const classDateTime = new Date(localStr);
    console.log(cls.title || cls._id.toString(), '->', classDateTime.toISOString());
    await Class.updateOne({ _id: cls._id }, { classDateTime, timezone: 'Asia/Karachi' });
  }

  console.log('Migration complete');
  await mongoose.disconnect();
}

migrate().catch(console.error);
