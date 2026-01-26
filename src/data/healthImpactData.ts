// Smoking Health Impact Data (based on monthly TAR and Nicotine levels)
export interface SmokingHealthTier {
  tarRange: { min: number; max: number };
  nicotineRange: { min: number; max: number };
  riskTier: string;
  riskColor: string;
  healthImpact: string;
  addictionImpact: string;
}

export const smokingHealthTiers: SmokingHealthTier[] = [
  {
    tarRange: { min: 0, max: 1500 },
    nicotineRange: { min: 0, max: 120 },
    riskTier: "Safe / Monitoring",
    riskColor: "success",
    healthImpact: "Statistical likelihood of lung stress is minimal; natural clearing processes remain highly active.",
    addictionImpact: "Low impact on brain chemistry; behavioral pattern is likely situational rather than a physical requirement."
  },
  {
    tarRange: { min: 1501, max: 3000 },
    nicotineRange: { min: 121, max: 250 },
    riskTier: "Monitoring",
    riskColor: "warning",
    healthImpact: "Possible early probability of minor airway irritation or statistical decrease in peak athletic stamina.",
    addictionImpact: "Moderate behavioral impact; daily routines begin to statistically align with specific smoking times."
  },
  {
    tarRange: { min: 3001, max: 4500 },
    nicotineRange: { min: 251, max: 380 },
    riskTier: "Elevated",
    riskColor: "warning",
    healthImpact: "Increased statistical probability of cardiovascular strain; potential for heart rate to remain elevated post-activity.",
    addictionImpact: "High addiction potential; statistical likelihood of withdrawal-related irritability or restlessness if intake is delayed."
  },
  {
    tarRange: { min: 4501, max: 6000 },
    nicotineRange: { min: 381, max: 500 },
    riskTier: "High",
    riskColor: "destructive",
    healthImpact: "Significant statistical probability of persistent lung stress; the body's self-cleaning efficiency is likely hampered.",
    addictionImpact: "Very high addiction impact; behavioral patterns are frequently dictated by the brain's chemical requirement for nicotine."
  },
  {
    tarRange: { min: 6001, max: 8000 },
    nicotineRange: { min: 501, max: 650 },
    riskTier: "Critical",
    riskColor: "destructive",
    healthImpact: "High statistical likelihood of chronic respiratory strain and consistent stress on the heart and blood vessels.",
    addictionImpact: "Extreme addiction impact; statistical data suggests smoking likely occurs within 30 minutes of waking; high behavioral dependency."
  },
  {
    tarRange: { min: 8001, max: Infinity },
    nicotineRange: { min: 651, max: Infinity },
    riskTier: "Emergency",
    riskColor: "destructive",
    healthImpact: "Severe statistical probability of long-term lung and heart fatigue; physical capacity is likely consistently compromised.",
    addictionImpact: "Maximum addiction impact; daily behavior is almost entirely focused on maintaining nicotine levels; highest probability of severe withdrawal."
  }
];

// Vape Health Impact Data (based on monthly CEI and Nicotine levels)
export interface VapeHealthTier {
  ceiRange: { min: number; max: number };
  nicotineRange: { min: number; max: number };
  riskTier: string;
  riskColor: string;
  healthImpact: string;
  addictionImpact: string;
}

export const vapeHealthTiers: VapeHealthTier[] = [
  {
    ceiRange: { min: 0, max: 1500 },
    nicotineRange: { min: 0, max: 120 },
    riskTier: "Safe / Monitoring",
    riskColor: "success",
    healthImpact: "Statistical likelihood of airway irritation is minimal; lung recovery remains highly active.",
    addictionImpact: "Low impact on brain chemistry; usage is likely situational rather than a physical requirement."
  },
  {
    ceiRange: { min: 1501, max: 3000 },
    nicotineRange: { min: 121, max: 250 },
    riskTier: "Monitoring",
    riskColor: "warning",
    healthImpact: "Possible early probability of throat dryness or statistical decrease in peak athletic stamina.",
    addictionImpact: "Moderate behavioral impact; daily routines begin to statistically align with specific vaping times."
  },
  {
    ceiRange: { min: 3001, max: 4500 },
    nicotineRange: { min: 251, max: 380 },
    riskTier: "Elevated",
    riskColor: "warning",
    healthImpact: "Increased statistical probability of cardiovascular strain; heart rate may remain elevated longer.",
    addictionImpact: "High addiction potential; statistical likelihood of cravings or restlessness if vaping is delayed."
  },
  {
    ceiRange: { min: 4501, max: 6000 },
    nicotineRange: { min: 381, max: 500 },
    riskTier: "High",
    riskColor: "destructive",
    healthImpact: "Significant statistical probability of persistent airway stress; body's self-cleaning efficiency may be hampered.",
    addictionImpact: "Very high addiction impact; behavioral patterns frequently dictated by the brain's chemical requirement."
  },
  {
    ceiRange: { min: 6001, max: 8000 },
    nicotineRange: { min: 501, max: 650 },
    riskTier: "Critical",
    riskColor: "destructive",
    healthImpact: "High statistical likelihood of chronic respiratory strain and consistent stress on the heart and blood vessels.",
    addictionImpact: "Extreme addiction impact; statistical data suggests vaping occurs frequently throughout the day; high dependency."
  },
  {
    ceiRange: { min: 8001, max: Infinity },
    nicotineRange: { min: 651, max: Infinity },
    riskTier: "Emergency",
    riskColor: "destructive",
    healthImpact: "Severe statistical probability of long-term lung fatigue; physical capacity is likely consistently compromised.",
    addictionImpact: "Maximum addiction impact; daily behavior is almost entirely focused on maintaining nicotine levels."
  }
];

// Helper functions to get the appropriate tier
export const getSmokingHealthTier = (monthlyTar: number, monthlyNicotine: number): SmokingHealthTier => {
  // Find tier based on whichever metric is higher
  for (const tier of smokingHealthTiers) {
    if (
      (monthlyTar >= tier.tarRange.min && monthlyTar <= tier.tarRange.max) ||
      (monthlyNicotine >= tier.nicotineRange.min && monthlyNicotine <= tier.nicotineRange.max)
    ) {
      // If either metric falls in this tier, check if the other is in a higher tier
      const tarTierIndex = smokingHealthTiers.findIndex(
        t => monthlyTar >= t.tarRange.min && monthlyTar <= t.tarRange.max
      );
      const nicotineTierIndex = smokingHealthTiers.findIndex(
        t => monthlyNicotine >= t.nicotineRange.min && monthlyNicotine <= t.nicotineRange.max
      );
      
      // Return the higher (worse) tier
      const higherIndex = Math.max(tarTierIndex, nicotineTierIndex);
      return smokingHealthTiers[higherIndex >= 0 ? higherIndex : 0];
    }
  }
  return smokingHealthTiers[0];
};

export const getVapeHealthTier = (monthlyCEI: number, monthlyNicotine: number): VapeHealthTier => {
  // Find tier based on whichever metric is higher
  for (const tier of vapeHealthTiers) {
    if (
      (monthlyCEI >= tier.ceiRange.min && monthlyCEI <= tier.ceiRange.max) ||
      (monthlyNicotine >= tier.nicotineRange.min && monthlyNicotine <= tier.nicotineRange.max)
    ) {
      // If either metric falls in this tier, check if the other is in a higher tier
      const ceiTierIndex = vapeHealthTiers.findIndex(
        t => monthlyCEI >= t.ceiRange.min && monthlyCEI <= t.ceiRange.max
      );
      const nicotineTierIndex = vapeHealthTiers.findIndex(
        t => monthlyNicotine >= t.nicotineRange.min && monthlyNicotine <= t.nicotineRange.max
      );
      
      // Return the higher (worse) tier
      const higherIndex = Math.max(ceiTierIndex, nicotineTierIndex);
      return vapeHealthTiers[higherIndex >= 0 ? higherIndex : 0];
    }
  }
  return vapeHealthTiers[0];
};
