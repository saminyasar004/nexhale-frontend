// Extended mood options for vape logging
export interface VapeMood {
  value: string;
  label: string;
  emoji: string;
  category: "emotional" | "situational" | "physical" | "social";
}

export const vapeMoods: VapeMood[] = [
  // Emotional
  { value: "relaxed", label: "Relaxed", emoji: "😌", category: "emotional" },
  { value: "stressed", label: "Stressed", emoji: "😰", category: "emotional" },
  { value: "happy", label: "Happy", emoji: "😊", category: "emotional" },
  { value: "anxious", label: "Anxious", emoji: "😟", category: "emotional" },
  { value: "sad", label: "Sad", emoji: "😢", category: "emotional" },
  { value: "frustrated", label: "Frustrated", emoji: "😤", category: "emotional" },
  { value: "excited", label: "Excited", emoji: "🤩", category: "emotional" },
  { value: "calm", label: "Calm", emoji: "😇", category: "emotional" },
  { value: "irritated", label: "Irritated", emoji: "😠", category: "emotional" },
  { value: "content", label: "Content", emoji: "🙂", category: "emotional" },
  
  // Situational
  { value: "after_meal", label: "After Meal", emoji: "🍽️", category: "situational" },
  { value: "with_coffee", label: "With Coffee", emoji: "☕", category: "situational" },
  { value: "on_break", label: "On Break", emoji: "⏸️", category: "situational" },
  { value: "while_driving", label: "While Driving", emoji: "🚗", category: "situational" },
  { value: "while_working", label: "While Working", emoji: "💼", category: "situational" },
  { value: "while_gaming", label: "While Gaming", emoji: "🎮", category: "situational" },
  { value: "watching_tv", label: "Watching TV", emoji: "📺", category: "situational" },
  { value: "before_sleep", label: "Before Sleep", emoji: "🌙", category: "situational" },
  { value: "morning_routine", label: "Morning Routine", emoji: "🌅", category: "situational" },
  { value: "after_exercise", label: "After Exercise", emoji: "🏃", category: "situational" },
  
  // Physical
  { value: "craving", label: "Craving", emoji: "🔥", category: "physical" },
  { value: "tired", label: "Tired", emoji: "😴", category: "physical" },
  { value: "bored", label: "Bored", emoji: "😐", category: "physical" },
  { value: "restless", label: "Restless", emoji: "🥴", category: "physical" },
  { value: "headache", label: "Headache", emoji: "🤕", category: "physical" },
  { value: "throat_dry", label: "Throat Dry", emoji: "💧", category: "physical" },
  { value: "energized", label: "Energized", emoji: "⚡", category: "physical" },
  { value: "nauseous", label: "Nauseous", emoji: "🤢", category: "physical" },
  
  // Social
  { value: "with_friends", label: "With Friends", emoji: "👥", category: "social" },
  { value: "at_party", label: "At Party", emoji: "🎉", category: "social" },
  { value: "alone", label: "Alone", emoji: "🧍", category: "social" },
  { value: "socializing", label: "Socializing", emoji: "💬", category: "social" },
  { value: "celebrating", label: "Celebrating", emoji: "🥳", category: "social" },
];

// Group moods by category for organized display
export const getMoodsByCategory = () => {
  const categories = {
    emotional: vapeMoods.filter(m => m.category === "emotional"),
    situational: vapeMoods.filter(m => m.category === "situational"),
    physical: vapeMoods.filter(m => m.category === "physical"),
    social: vapeMoods.filter(m => m.category === "social"),
  };
  return categories;
};

// Get formatted mood options for select dropdown
export const getVapeMoodOptions = () => {
  return vapeMoods.map(mood => ({
    value: mood.value,
    label: `${mood.emoji} ${mood.label}`,
    category: mood.category,
  }));
};
