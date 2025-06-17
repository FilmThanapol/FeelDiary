
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      calendar: 'Calendar',
      profile: 'Profile',
      signOut: 'Sign Out',
      signIn: 'Sign In with Google',
      
      // Mood Entry
      todayMood: "Today's Mood",
      howAreYou: 'How are you feeling today?',
      addNotes: 'Add notes (optional)',
      saveMood: 'Save Mood',
      updateMood: 'Update Mood',
      noEntryToday: 'No entry for today',
      
      // Analytics
      analytics: 'Analytics',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      moodTrends: 'Mood Trends',
      moodDistribution: 'Mood Distribution',
      averageMood: 'Average Mood',
      totalEntries: 'Total Entries',
      
      // Mood Labels
      terrible: 'Terrible',
      bad: 'Bad',
      okay: 'Okay',
      good: 'Good',
      excellent: 'Excellent',
      
      // Export
      exportData: 'Export Data',
      exportCSV: 'Export CSV',
      exportPDF: 'Export PDF',
      
      // Settings
      settings: 'Settings',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      dailyReminder: 'Daily Reminder',
      reminderTime: 'Reminder Time',
      
      // Guest Mode
      guestMode: 'Guest Mode',
      tryWithoutLogin: 'Try without login',
      guestModeNote: 'Guest mode data will not be saved',
      
      // Calendar
      viewEntry: 'View Entry',
      editEntry: 'Edit Entry',
      deleteEntry: 'Delete Entry',
      
      // Common
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      
      // Welcome
      welcome: 'Welcome to Mood Tracker',
      trackYourMood: 'Track your daily mood and build healthy habits',
      getStarted: 'Get Started'
    }
  },
  th: {
    translation: {
      // Navigation
      dashboard: 'แดชบอร์ด',
      calendar: 'ปฏิทิน',
      profile: 'โปรไฟล์',
      signOut: 'ออกจากระบบ',
      signIn: 'เข้าสู่ระบบด้วย Google',
      
      // Mood Entry
      todayMood: 'อารมณ์วันนี้',
      howAreYou: 'วันนี้คุณรู้สึกอย่างไร?',
      addNotes: 'เพิ่มบันทึก (ไม่บังคับ)',
      saveMood: 'บันทึกอารมณ์',
      updateMood: 'อัปเดตอารมณ์',
      noEntryToday: 'ยังไม่มีการบันทึกวันนี้',
      
      // Analytics
      analytics: 'การวิเคราะห์',
      last7Days: '7 วันที่ผ่านมา',
      last30Days: '30 วันที่ผ่านมา',
      moodTrends: 'แนวโน้มอารมณ์',
      moodDistribution: 'การกระจายอารมณ์',
      averageMood: 'อารมณ์เฉลี่ย',
      totalEntries: 'จำนวนการบันทึกทั้งหมด',
      
      // Mood Labels
      terrible: 'แย่มาก',
      bad: 'แย่',
      okay: 'พอใช้',
      good: 'ดี',
      excellent: 'ยอดเยี่ยม',
      
      // Export
      exportData: 'ส่งออกข้อมูล',
      exportCSV: 'ส่งออก CSV',
      exportPDF: 'ส่งออก PDF',
      
      // Settings
      settings: 'การตั้งค่า',
      language: 'ภาษา',
      theme: 'ธีม',
      light: 'สว่าง',
      dark: 'มืด',
      dailyReminder: 'การแจ้งเตือนรายวัน',
      reminderTime: 'เวลาแจ้งเตือน',
      
      // Guest Mode
      guestMode: 'โหมดผู้เยี่ยมชม',
      tryWithoutLogin: 'ลองใช้โดยไม่ต้องเข้าสู่ระบบ',
      guestModeNote: 'ข้อมูลในโหมดผู้เยี่ยมชมจะไม่ถูกบันทึก',
      
      // Calendar
      viewEntry: 'ดูรายการ',
      editEntry: 'แก้ไขรายการ',
      deleteEntry: 'ลบรายการ',
      
      // Common
      save: 'บันทึก',
      cancel: 'ยกเลิก',
      delete: 'ลบ',
      edit: 'แก้ไข',
      close: 'ปิด',
      loading: 'กำลังโหลด...',
      error: 'ข้อผิดพลาด',
      success: 'สำเร็จ',
      
      // Welcome
      welcome: 'ยินดีต้อนรับสู่ Mood Tracker',
      trackYourMood: 'ติดตามอารมณ์รายวันและสร้างนิสัยที่ดี',
      getStarted: 'เริ่มต้น'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
