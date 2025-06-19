
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
      getStarted: 'Get Started',

      // Wellness Hub
      wellness: 'Wellness',
      wellnessHub: 'Wellness Hub',
      mentalHealthSupport: 'Mental Health Support',
      breathingExercise: 'Breathing Exercise',
      moodGoals: 'Mood Goals',
      wellnessTips: 'Wellness Tips',
      emergencyResources: 'Emergency Resources',

      // Mood Analytics
      moodAnalytics: 'Mood Analytics',
      patterns: 'Patterns',
      trends: 'Trends',
      insights: 'Insights',
      predictions: 'Predictions',
      weeklyPatterns: 'Weekly Patterns',
      currentStreak: 'Current Streak',
      longestStreak: 'Longest Streak',
      positiveStreak: 'Positive Streak',
      days: 'days',

      // Heatmap
      moodHeatmap: 'Mood Heatmap',
      dailyMoodOverview: 'Daily Mood Overview',
      consistency: 'Consistency',
      bestMood: 'Best Mood',
      lowestMood: 'Lowest Mood',
      monthlyBreakdown: 'Monthly Breakdown',

      // Goals
      weeklyGoal: 'Weekly Goal',
      dailyCheckIn: 'Daily Check-in',
      positiveStreakGoal: 'Positive Streak',
      mindfulnessPractice: 'Mindfulness Practice',
      socialConnection: 'Social Connection',

      // Breathing Exercise
      breathingInstructions: 'Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds',
      startExercise: 'Start Exercise',
      stopExercise: 'Stop',
      breatheIn: 'Breathe In...',
      hold: 'Hold...',
      breatheOut: 'Breathe Out...',

      // Wellness Categories
      mindfulness: 'Mindfulness',
      physicalHealth: 'Physical Health',
      selfCare: 'Self-Care',

      // Time ranges
      lastWeek: 'Last Week',
      lastMonth: 'Last Month',
      lastQuarter: 'Last Quarter',

      // Mood descriptions
      havingToughDay: 'Having a really tough day',
      feelingDown: 'Feeling down or stressed',
      neutralFeeling: 'Neutral, nothing special',
      feelingPositive: 'Feeling positive and happy',
      amazingDay: 'Amazing day, feeling great!',

      // Notifications
      notesPlaceholder: 'What\'s on your mind? Share your thoughts, what influenced your mood today...',

      // Additional UI text
      entries: 'entries',
      noMoodEntries: 'No mood entries yet',
      startTracking: 'Start tracking your mood to see entries here',
      signInToSee: 'Sign in to see your mood heatmap',
      moodEntry: 'Mood entry',
      noEntryForDay: 'No mood entry for this day'
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
      getStarted: 'เริ่มต้น',

      // Wellness Hub
      wellness: 'สุขภาวะ',
      wellnessHub: 'ศูนย์สุขภาวะ',
      mentalHealthSupport: 'การสนับสนุนสุขภาพจิต',
      breathingExercise: 'การฝึกหายใจ',
      moodGoals: 'เป้าหมายอารมณ์',
      wellnessTips: 'เคล็ดลับสุขภาวะ',
      emergencyResources: 'ทรัพยากรฉุกเฉิน',

      // Mood Analytics
      moodAnalytics: 'การวิเคราะห์อารมณ์',
      patterns: 'รูปแบบ',
      trends: 'แนวโน้ม',
      insights: 'ข้อมูลเชิงลึก',
      predictions: 'การทำนาย',
      weeklyPatterns: 'รูปแบบรายสัปดาห์',
      currentStreak: 'ช่วงต่อเนื่องปัจจุบัน',
      longestStreak: 'ช่วงต่อเนื่องที่ยาวที่สุด',
      positiveStreak: 'ช่วงอารมณ์ดี',
      days: 'วัน',

      // Heatmap
      moodHeatmap: 'แผนที่ความร้อนอารมณ์',
      dailyMoodOverview: 'ภาพรวมอารมณ์รายวัน',
      consistency: 'ความสม่ำเสมอ',
      bestMood: 'อารมณ์ดีที่สุด',
      lowestMood: 'อารมณ์แย่ที่สุด',
      monthlyBreakdown: 'รายละเอียดรายเดือน',

      // Goals
      weeklyGoal: 'เป้าหมายรายสัปดาห์',
      dailyCheckIn: 'การตรวจสอบรายวัน',
      positiveStreakGoal: 'เป้าหมายอารมณ์ดีต่อเนื่อง',
      mindfulnessPractice: 'การฝึกสติ',
      socialConnection: 'การเชื่อมต่อทางสังคม',

      // Breathing Exercise
      breathingInstructions: 'หายใจเข้า 4 วินาที กลั้น 7 วินาที หายใจออก 8 วินาที',
      startExercise: 'เริ่มการฝึก',
      stopExercise: 'หยุด',
      breatheIn: 'หายใจเข้า...',
      hold: 'กลั้น...',
      breatheOut: 'หายใจออก...',

      // Wellness Categories
      mindfulness: 'การฝึกสติ',
      physicalHealth: 'สุขภาพกาย',
      selfCare: 'การดูแลตนเอง',

      // Time ranges
      lastWeek: 'สัปดาห์ที่แล้ว',
      lastMonth: 'เดือนที่แล้ว',
      lastQuarter: 'ไตรมาสที่แล้ว',

      // Mood descriptions
      havingToughDay: 'วันที่ยากลำบากมาก',
      feelingDown: 'รู้สึกหดหู่หรือเครียด',
      neutralFeeling: 'เฉยๆ ไม่มีอะไรพิเศษ',
      feelingPositive: 'รู้สึกดีและมีความสุข',
      amazingDay: 'วันที่ยอดเยี่ยม รู้สึกดีมาก!',

      // Notifications
      notesPlaceholder: 'คุณคิดอะไรอยู่? แบ่งปันความคิดของคุณ สิ่งที่ส่งผลต่ออารมณ์วันนี้...',

      // Additional UI text
      entries: 'รายการ',
      noMoodEntries: 'ยังไม่มีการบันทึกอารมณ์',
      startTracking: 'เริ่มติดตามอารมณ์ของคุณเพื่อดูรายการที่นี่',
      signInToSee: 'เข้าสู่ระบบเพื่อดูแผนที่ความร้อนอารมณ์ของคุณ',
      moodEntry: 'การบันทึกอารมณ์',
      noEntryForDay: 'ไม่มีการบันทึกอารมณ์สำหรับวันนี้'
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
