import React, { useState } from "react";
import axios from "axios";
import DailyCaloriesForm from "../../components/DailyCaloriesForm/DailyCaloriesForm";
import Modal from "../../components/Modal/Modal";
import DailyCalorieIntake from "../../components/DailyCalorieIntake/DailyCalorieIntake";

const CalculatorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calculatedData, setCalculatedData] = useState(null);

  const handleFormSubmit = async (formData) => {
    console.log("Form submitted:", formData);

    try {
      const response = await axios.post("/api/v1/calories/public", formData);

      const { dailyRate, forbiddenFoods } = response.data;

      console.log("Daily calories:", dailyRate);
      console.log("Forbidden foods:", forbiddenFoods);

      setCalculatedData({
        calories: dailyRate,
        foods: forbiddenFoods,
      });

      setIsModalOpen(true);
      console.log("Modal open state set");
    } catch (error) {
      console.error(
        "Calorie calculation failed:",
        error.response?.data || error.message
      );
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCalculatedData(null);
  };

  return (
    <div>
      <DailyCaloriesForm onSubmit={handleFormSubmit} />

      {isModalOpen && calculatedData && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <DailyCalorieIntake
            dailyRate={calculatedData.calories}
            forbiddenFoods={calculatedData.foods}
            onClose={closeModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default CalculatorPage;
