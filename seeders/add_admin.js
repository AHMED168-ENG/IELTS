const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // استيراد مكتبة bcrypt
const User = require('../models/users'); // تأكد من مسار الموديل الخاص بك

// بيانات الاتصال بقاعدة البيانات
const dbUri = 'mongodb://localhost:27017/ieltsExam'; // قم بتغيير اسم قاعدة البيانات

// بيانات المستخدم الإداري
const adminData = {
  name: 'Fahad Alanazi',
  email: 'falanazi@nadeer.com.sa',
  password: 'Aa!123456',
  isAdmin: true,
  gender: true,
  age: 25,
  active: true,
};

async function createAdminUser() {
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to the database.');

    // فحص وجود المستخدمين
    const userCount = await User.countDocuments();

    if (userCount === 0) {
      // تشفير كلمة المرور
      const saltRounds = 10; // عدد الجولات (Rounds) للتشفير
      const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
      adminData.password = hashedPassword; // استبدال كلمة المرور المشفرة

      // إنشاء المستخدم الإداري
      const newUser = new User(adminData);
      await newUser.save();
      console.log('Admin user created successfully:', adminData.email);
    } else {
      console.log('Users already exist. No admin user was created.');
    }

    // إنهاء الاتصال بقاعدة البيانات
    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    mongoose.connection.close();
  }
}

// تشغيل الوظيفة
createAdminUser();
