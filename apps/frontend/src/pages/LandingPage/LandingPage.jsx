import React, { useState, useEffect } from "react";
import axios from "axios";
import DailyCaloriesForm from "../../components/DailyCaloriesForm/DailyCaloriesForm";
import Modal from "../../components/Modal/Modal";
import DailyCalorieIntake from "../../components/DailyCalorieIntake/DailyCalorieIntake";
import css from "./LandingPage.module.css";

// ögeleri rastgele karıştırmak için shuffle fonksiyonu
const shuffleArray = (array) => {
  const newArray = [...array];
  let currentIndex = newArray.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }
  return newArray;
};

const mapBloodGroup = (bloodType) => {
  // API numeric mapping for ABO: 1=A, 2=B, 3=AB, 4=0
  const stringToNumberMap = { A: 1, B: 2, AB: 3, 0: 4 };

  const numericBloodGroup = Number(bloodType);
  if ([1, 2, 3, 4].includes(numericBloodGroup)) {
    return numericBloodGroup;
  }

  if (stringToNumberMap[bloodType]) {
    return stringToNumberMap[bloodType];
  }

  return null;
};

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dailyRate, setDailyRate] = useState(null);
  const [forbiddenFoods, setForbiddenFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setErrorMessage(null);

    const mappedBloodGroup = mapBloodGroup(formData.bloodType);

    if (mappedBloodGroup === null) {
      const msg = "Blood type is required.";
      console.error(msg);
      setErrorMessage(msg);
      setIsLoading(false);
      return;
    }

    const activityLevelMultiplier = Number(formData.activityLevel);

    if (isNaN(activityLevelMultiplier) || activityLevelMultiplier <= 0) {
      const msg = "Activity level is invalid or missing.";
      console.error(msg);
      setErrorMessage(msg);
      setIsLoading(false);
      return;
    }

    const requestBody = {
      height: Number(formData.height),
      age: Number(formData.age),
      weight: Number(formData.currentWeight),
      targetWeight: Number(formData.desiredWeight),
      bloodGroup: mappedBloodGroup,
      activityLevel: activityLevelMultiplier,
    };
    const API_URL = "https://slimmoms-j4sf.onrender.com/api/v1/calories/intake";

    try {
      const response = await axios.post(API_URL, requestBody);

      const { dailyRate, forbiddenFoods: allForbiddenFoodsFromApi } =
        response.data;

      const shuffledFoods = shuffleArray(allForbiddenFoodsFromApi);

      const randomFiveForbiddenFoods = shuffledFoods.slice(0, 5);

      setDailyRate(dailyRate);
      setForbiddenFoods(randomFiveForbiddenFoods);

      setIsModalOpen(true);

    } catch (error) {

      let message = error.message || "Bilinmeyen bir hata oluştu.";

      if (error.response && error.response.data) {
        if (error.response.data.message) {
          message = error.response.data.message;
        } else if (error.response.data.error) {
          message = error.response.data.error;
        }
        console.error(
          "Full error response:",
          JSON.stringify(error.response.data, null, 2)
        );
      } else if (error.response && error.response.status === 400) {
        message = "Backend doğrulama hatası. Lütfen tüm alanları kontrol edin.";
      }

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage(null);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen]);

  return (
    <div className={css.LandingPageWrapper}>
      <main className={css.mainContent}>
        <DailyCaloriesForm
          onFormSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
        {errorMessage && (
          <div
            className={css.errorMessage}
            onClick={() => setErrorMessage(null)}
          >
            {errorMessage}
          </div>
        )}
      </main>
      {/* Modal */}
      {isModalOpen && dailyRate !== null && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <DailyCalorieIntake
            dailyRate={dailyRate}
            forbiddenFoods={forbiddenFoods}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default LandingPage;