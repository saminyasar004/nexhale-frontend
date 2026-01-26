export interface SmokingMood {
  emoji: string;
  label: string;
  value: string;
  category: "emotional" | "situational" | "physical";
}

export const smokingMoods: SmokingMood[] = [
  // Emotional moods
  { emoji: "😌", label: "Relaxed", value: "relaxed", category: "emotional" },
  { emoji: "😰", label: "Stressed", value: "stressed", category: "emotional" },
  { emoji: "😟", label: "Anxious", value: "anxious", category: "emotional" },
  { emoji: "😔", label: "Sad", value: "sad", category: "emotional" },
  { emoji: "😤", label: "Frustrated", value: "frustrated", category: "emotional" },
  { emoji: "😊", label: "Happy", value: "happy", category: "emotional" },
  { emoji: "😐", label: "Bored", value: "bored", category: "emotional" },
  { emoji: "😶", label: "Numb", value: "numb", category: "emotional" },
  
  // Situational moods
  { emoji: "☕", label: "With Coffee", value: "with-coffee", category: "situational" },
  { emoji: "🍺", label: "Drinking", value: "drinking", category: "situational" },
  { emoji: "🎉", label: "Social / Party", value: "social", category: "situational" },
  { emoji: "💼", label: "Work Break", value: "work-break", category: "situational" },
  { emoji: "🚗", label: "Driving", value: "driving", category: "situational" },
  { emoji: "📱", label: "After Phone Call", value: "after-call", category: "situational" },
  { emoji: "🍽️", label: "After Meal", value: "after-meal", category: "situational" },
  { emoji: "🌙", label: "Late Night", value: "late-night", category: "situational" },
  
  // Physical moods
  { emoji: "😴", label: "Tired", value: "tired", category: "physical" },
  { emoji: "🤢", label: "Nauseous", value: "nauseous", category: "physical" },
  { emoji: "🤕", label: "Headache", value: "headache", category: "physical" },
  { emoji: "💪", label: "Craving", value: "craving", category: "physical" },
  { emoji: "😮‍💨", label: "Need a Break", value: "need-break", category: "physical" },
];

// Get moods grouped by category
export const getMoodsByCategory = () => {
  return {
    emotional: smokingMoods.filter(m => m.category === "emotional"),
    situational: smokingMoods.filter(m => m.category === "situational"),
    physical: smokingMoods.filter(m => m.category === "physical"),
  };
};

export default smokingMoods;
