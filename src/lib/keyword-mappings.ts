export const keywordMappings = {
  jobCategories: {
    corporate_sales: [
      "法人営業",
      "BtoB営業",
      "B2B営業",
      "企業営業",
      "法人向け営業",
      "コーポレート営業",
      "法人セールス",
      "企業向けセールス",
    ],
    account_planner: [
      "企画営業",
      "アカウント営業",
      "提案営業",
      "ソリューション営業",
      "アカウントプランナー",
      "営業企画",
    ],
    inside_sales: ["インサイドセールス", "内勤営業", "テレセールス", "電話営業", "オンライン営業", "リモート営業"],
    engineer: [
      "エンジニア",
      "SE",
      "プログラマー",
      "開発者",
      "システムエンジニア",
      "フロントエンド",
      "バックエンド",
      "フルスタック",
    ],
    designer: [
      "デザイナー",
      "UI/UX",
      "グラフィック",
      "Webデザイナー",
      "プロダクトデザイナー",
      "UIデザイナー",
      "UXデザイナー",
    ],
  },
  locations: {
    tokyo: ["東京", "都内", "東京都", "23区", "東京23区", "トーキョー"],
    kanagawa: ["神奈川", "横浜", "川崎", "神奈川県"],
    osaka: ["大阪", "関西", "大阪府", "大阪市"],
    kanto: ["関東", "首都圏", "関東圏", "東京近郊"],
  },
  agePatterns: [/(\d{1,2})歳?[から〜-](\d{1,2})歳/, /(\d{1,2})-(\d{1,2})歳/, /(\d{1,2})代/, /20代|30代|40代/],
}

export const fuzzyMappings = {
  age: {
    "20代": { min: 20, max: 29 },
    "20代前半": { min: 20, max: 25 },
    "20代後半": { min: 26, max: 29 },
    "30代": { min: 30, max: 39 },
    "30代前半": { min: 30, max: 35 },
    "30代後半": { min: 36, max: 39 },
    "30歳前後": { min: 28, max: 32 },
    若手: { min: 22, max: 30 },
    シニア: { min: 35, max: 50 },
  },
  experience: {
    新人: "1年未満",
    若手: "1-3年",
    中堅: "3-7年",
    ベテラン: "7年以上",
    経験者: "1年以上",
  },
}

export interface ParsedConditions {
  jobCategories: string[]
  locations: string[]
  ageRange: { min: number; max: number } | null
  experience: string[]
}

// Improved parsing function with better natural language processing
export const parseConditionsImproved = (text: string): ParsedConditions => {
  const conditions: ParsedConditions = {
    jobCategories: [],
    locations: [],
    ageRange: null,
    experience: [],
  }

  // Parse job categories with multiple keyword matching
  for (const [category, keywords] of Object.entries(keywordMappings.jobCategories)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      conditions.jobCategories.push(category)
    }
  }

  // Parse locations with synonym support
  for (const [region, variations] of Object.entries(keywordMappings.locations)) {
    if (variations.some((variation) => text.includes(variation))) {
      conditions.locations.push(region)
    }
  }

  // Parse age ranges with fuzzy matching
  for (const [ageText, range] of Object.entries(fuzzyMappings.age)) {
    if (text.includes(ageText)) {
      conditions.ageRange = range
      break
    }
  }

  // Fallback to pattern matching for age
  if (!conditions.ageRange) {
    for (const pattern of keywordMappings.agePatterns) {
      const match = text.match(pattern)
      if (match) {
        const age = Number.parseInt(match[1] || match[2])
        if (match[1]) {
          // 20代 format
          conditions.ageRange = { min: age, max: age + 9 }
        } else {
          // specific age
          conditions.ageRange = { min: age - 2, max: age + 2 }
        }
        break
      }
    }
  }

  // Parse experience levels
  for (const [expText, expLevel] of Object.entries(fuzzyMappings.experience)) {
    if (text.includes(expText)) {
      conditions.experience.push(expLevel)
    }
  }

  return conditions
}