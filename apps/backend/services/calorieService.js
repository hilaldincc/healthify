import Product from "../models/Product.js";

// Günlük Aktivite Çarpanları (Genel olarak kullanılan değerler)
const activityFactors = {
  sedentary: 1.2, // Hareketsiz
  light: 1.375, // Hafif aktif
  moderate: 1.55, // Orta aktif
  veryActive: 1.725, // Çok aktif
  extraActive: 1.9, // Ekstra aktif
};

/**
 * Günlük kalori ihtiyacını (TDEE) hesaplar.
 * Kadınlar için özel hedef odaklı formülü kullanır.
 */
function calculateDailyCalorieIntake(
  weight,
  height,
  age,
  activityLevel,
  targetWeight
) {
  // Kadınlar için özel formül (her zaman uygulanacak)
  const bmrAdjustment =
    10 * weight + 6.25 * height - 5 * age - 161 - 10 * (weight - targetWeight);

  const factor =
    activityFactors[activityLevel] ||
    Number(activityLevel) ||
    activityFactors.sedentary;

  const tdee = bmrAdjustment * factor;

  return Math.round(Math.max(1000, tdee));
}

/**
 * Kan Grubuna göre YASAKLANMIŞ ürünleri veritabanından bulur ve 5 tanesini RASTGELE seçer.
 * @param {number} bloodGroup - Kullanıcının kan grubu (1, 2, 3, 4)
 * @returns {Array} Yasaklanmış ürün başlıklarının listesi (Sadece rastgele 5 tanesi)
 */
async function getForbiddenProducts(bloodGroup) {
  if (!bloodGroup || bloodGroup < 1 || bloodGroup > 4) {
    return [];
  }
  const matchQuery = {};
  matchQuery[`groupBloodNotAllowed.${bloodGroup}`] = true;

  try {
    const matched = await Product.aggregate([
      { $match: matchQuery },
      { $sample: { size: 5 } },
      { $project: { title: 1, _id: 0 } },
    ]);
    return matched.map((item) => item.title);
  } catch (error) {
    console.error("Error fetching forbidden products:", error);
    return [];
  }
}

export { calculateDailyCalorieIntake, getForbiddenProducts };
