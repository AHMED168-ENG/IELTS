const mongoose = require('mongoose');

// استيراد موديل القسم
const Section = require('../models/sections'); // تأكد من مسار الموديل الخاص بك

// بيانات الاتصال بقاعدة البيانات
const dbUri = 'mongodb://localhost:27017/ieltsExam'; // قم بتغيير اسم قاعدة البيانات

// البيانات المستوردة من الملف
const sectionsData = [
  {
    section: "reading",
    duration: 60,
  },
  {
    section: "writing",
    duration: 20,
  },
  {
    section: "listening",
    duration: 35,
  },
  {
    section: "speaking",
    duration: 60,
  },
];

async function seedSections() {
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to the database.');

    // التحقق من وجود بيانات في الجدول
    const sectionCount = await Section.countDocuments();
    if (sectionCount > 0) {
      console.log('Sections data already exists. No new data was added.');
    } else {
      // إدخال البيانات الجديدة إذا كان الجدول فارغًا
      await Section.insertMany(sectionsData);
      console.log('Sections data seeded successfully.');
    }

    // إنهاء الاتصال بقاعدة البيانات
    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error seeding sections data:', error.message);
    mongoose.connection.close();
  }
}

// تشغيل الوظيفة
seedSections();
