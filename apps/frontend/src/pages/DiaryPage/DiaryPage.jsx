// src/pages/DiaryPage/DiaryPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { userTransactionApi } from "../../api/userTransactionApi";
import SummaryCard from "../../components/SummaryCards/SummaryCard";
import Loader from "../../components/Loader/Loader";
import styles from "./DiaryPage.module.css";

// 🔥 Yardımcı: Bugünün tarihini YYYY-MM-DD formatında verir
const getTodayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

const DiaryPage = () => {
  const token = localStorage.getItem("token");

  // ---------- STATE ----------
  const [today] = useState(getTodayISO); // sadece 1 kere hesaplanır

  const [date, setDate] = useState(today);

  const [dailyRate, setDailyRate] = useState(null);
  const [forbiddenFoods, setForbiddenFoods] = useState([]);
  const [userBloodGroup, setUserBloodGroup] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [grams, setGrams] = useState("");

  const [eatenProducts, setEatenProducts] = useState([]);
  const [consumedKcal, setConsumedKcal] = useState(0);

  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null); // forbidden uyarısı
  const [isLoadingDay, setIsLoadingDay] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 704 : false
  );
  const [isMobileAddMode, setIsMobileAddMode] = useState(false);

  const [isPageLoading, setIsPageLoading] = useState(true);

  // ---------- WINDOW RESIZE ----------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 769);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------- PROFIL + FORBIDDEN FOODS ----------
  useEffect(() => {
    if (!token) return;

    const loadProfile = async () => {
      try {
        const { data } = await userTransactionApi.get("/api/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = data.user || data;

        if (user.dailyCalorieGoal) setDailyRate(user.dailyCalorieGoal);
        if (user.dailyRate) setDailyRate(user.dailyRate);

        if (user.bloodGroup) {
          setUserBloodGroup(user.bloodGroup);

          const res = await userTransactionApi.get(
            `/api/v1/products/forbidden?bloodGroup=${user.bloodGroup}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (Array.isArray(res.data.forbiddenFoods)) {
            setForbiddenFoods(res.data.forbiddenFoods);
          }
        }
      } catch (err) {
        console.error("PROFILE ERROR:", err);
      }
    };

    loadProfile();
  }, [token]);

  // ---------- GÜN ÖZETİ ----------
  useEffect(() => {
    if (!token) return;

    const fetchDayInfo = async () => {
      setIsLoadingDay(true);
      setError(null);

      try {
        const { data } = await userTransactionApi.get(
          `/api/v1/day/info?date=${date}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setEatenProducts(
          (data.products || []).map((p) => ({
            id: p.id || p._id,
            title: p.title,
            weight: p.weight,
            calories: p.calories,
          }))
        );

        setConsumedKcal(data.consumedCalories || 0);
        setDailyRate(data.dailyGoal || dailyRate);
      } catch (err) {
        console.error("DAY INFO ERROR:", err);
        setError("Could not load daily information for this date.");
        setEatenProducts([]);
        setConsumedKcal(0);
      } finally {
        setIsLoadingDay(false);
        setIsPageLoading(false);
      }
    };

    fetchDayInfo();
  }, [date, token]);

  // ---------- ÜRÜN ARAMA ----------
  useEffect(() => {
    if (!token) return;

    if (!searchQuery.trim()) return setSearchResults([]);

    if (selectedProduct && searchQuery === selectedProduct.title) return;

    const delay = setTimeout(async () => {
      try {
        const { data } = await userTransactionApi.get(
          `/api/v1/products/search?query=${encodeURIComponent(searchQuery)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSearchResults(data.products || []);
      } catch (err) {
        console.error("SEARCH ERROR:", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery, token, selectedProduct]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearchQuery(product.title);
    setSearchResults([]);
  };

  // ---------- ÜRÜN EKLEME ----------
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !grams) return;

    // 🔒 İleri tarihe ekleme engeli
    if (date > today) {
      setError("You can only add products for today or past dates.");
      return;
    }

    setError(null);
    setWarning(null);

    // Yasak ürün → EKLE ama UYAR
    if (
      userBloodGroup &&
      selectedProduct.groupBloodNotAllowed &&
      Array.isArray(selectedProduct.groupBloodNotAllowed)
    ) {
      const index = Number(userBloodGroup) - 1;
      if (selectedProduct.groupBloodNotAllowed[index]) {
        setWarning("⚠️ This product is not recommended for your blood group.");
        // return YOK → ürün eklenmeye devam edecek
      }
    }

    setIsAdding(true);

    try {
      const body = {
        date,
        productId: selectedProduct._id,
        weight: Number(grams),
      };

      const { data } = await userTransactionApi.post(
        "/api/v1/day/add-product",
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const day = data.day;
      if (day) {
        setEatenProducts(
          day.consumedProducts.map((p) => ({
            id: p._id,
            title: p.title,
            weight: p.weight,
            calories: p.calories,
          }))
        );
        setConsumedKcal(day.totalCalories);
      }

      setSearchQuery("");
      setSelectedProduct(null);
      setGrams("");

      if (isMobile) setIsMobileAddMode(false);
    } catch (err) {
      console.error("ADD PRODUCT ERROR:", err);
      setError("Could not add this product.");
    } finally {
      setIsAdding(false);
    }
  };

  // ---------- ÜRÜN SİLME ----------
  const handleDeleteProduct = async (consumedId) => {
    try {
      const { data } = await userTransactionApi.delete(
        "/api/v1/day/delete-product",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { consumedProductId: consumedId },
        }
      );

      const day = data.day;
      if (day) {
        setEatenProducts(
          day.consumedProducts.map((p) => ({
            id: p._id,
            title: p.title,
            weight: p.weight,
            calories: p.calories,
          }))
        );
        setConsumedKcal(day.totalCalories);
      }
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  // ---------- LABEL / HESAPLAMALAR ----------
  const dateLabel = useMemo(() => {
    const d = new Date(date);
    return d.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, [date]);

  const percentOfNormal = useMemo(() => {
    if (!dailyRate || dailyRate <= 0) return 0;
    return Math.round((consumedKcal / dailyRate) * 100);
  }, [dailyRate, consumedKcal]);

  if (!token) return <Navigate to="/login" replace />;

  // ---------- FULL SCREEN LOADER ----------
  if (isPageLoading) {
    return <Loader full size={60} />;
  }

  // =====================================================================
  // MOBIL ADD SCREEN
  // =====================================================================
  if (isMobile && isMobileAddMode) {
    return (
      <section className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className={styles.mobileAddHeader}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setIsMobileAddMode(false)}
              >
                ←
              </button>
              <span className={styles.mobileAddTitle}>Add product</span>
            </div>

            <form className={styles.form} onSubmit={handleAddProduct}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Enter product name</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedProduct(null);
                    }}
                    placeholder="Eggplant"
                  />
                  {searchResults.length > 0 && (
                    <ul className={styles.suggestions}>
                      {searchResults.map((p) => (
                        <li
                          key={p._id}
                          onClick={() => handleSelectProduct(p)}
                          className={styles.suggestionItem}
                        >
                          {p.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className={styles.fieldSmall}>
                  <label className={styles.label}>Grams</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={grams}
                    min="1"
                    onChange={(e) => setGrams(e.target.value)}
                    placeholder="100"
                  />
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}
              {warning && <p className={styles.warning}>{warning}</p>}

              <button
                type="submit"
                className={styles.addBtnMobile}
                disabled={!selectedProduct || !grams || isAdding}
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  console.log('!selectedProduct || !grams || isAdding: ', !selectedProduct || !grams || isAdding);

  console.log('selectedProduct: ', selectedProduct);
  console.log('grams: ', grams);
  console.log('isAdding: ', isAdding);
  // =====================================================================
  // NORMAL SCREEN
  // =====================================================================
  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.dateRow}>
            <span className={styles.dateText}>{dateLabel}</span>

            <button
              type="button"
              className={styles.calendarBtn}
              onClick={() =>
                document.getElementById("hiddenDatePicker").showPicker()
              }
            >
              <span className={styles.calendarIcon} />
            </button>

            <input
              id="hiddenDatePicker"
              type="date"
              className={styles.hiddenDateInput}
              value={date}
              max={today} // 🔒 ileri tarih seçilemez
              onChange={(e) => {
                const picked = e.target.value;
                if (picked > today) {
                  setDate(today); // ileri seçerse bugüne çek
                } else {
                  setDate(picked);
                }
              }}
            />
          </div>

          {!isMobile && (
            <form className={styles.form} onSubmit={handleAddProduct}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Enter product name</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedProduct(null);
                    }}
                    placeholder="Eggplant"
                  />
                  {searchResults.length > 0 && (
                    <ul className={styles.suggestions}>
                      {searchResults.map((p) => (
                        <li
                          key={p._id}
                          onClick={() => handleSelectProduct(p)}
                          className={styles.suggestionItem}
                        >
                          {p.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className={styles.fieldSmall}>
                  <label className={styles.label}>Grams</label>
                  <input
                    className={styles.input}
                    type="number"
                    min="1"
                    value={grams}
                    onChange={(e) => setGrams(e.target.value)}
                    placeholder="100"
                  />
                </div>

                <button
                  type="submit"
                  className={styles.addBtnCircle}
                  disabled={!selectedProduct || !grams || isAdding}
                >
                  +
                </button>
              </div>

              {error && <p className={styles.error}>{error}</p>}
              {warning && <p className={styles.warning}>{warning}</p>}
            </form>
          )}

          <div className={styles.tableWrapper}>
            {isLoadingDay ? (
              <p>Loading day...</p>
            ) : eatenProducts.length === 0 ? (
              <p className={styles.emptyText}>You have not added any products yet.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Grams</th>
                    <th>kcal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {eatenProducts.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.weight}</td>
                      <td>{Math.round(item.calories)}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteProduct(item.id)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {isMobile && (
            <>
              <button
                type="button"
                className={styles.addBtnCircle}
                onClick={() => setIsMobileAddMode(true)}
              >
                +
              </button>

              <div className={styles.summaryBox}>
                <SummaryCard
                  date={dateLabel}
                  dailyRate={dailyRate}
                  consumed={consumedKcal}
                  forbiddenFoods={forbiddenFoods}
                  percentOfNormal={percentOfNormal}
                />
              </div>
            </>
          )}
        </div>

        {!isMobile && (
          <div className={styles.right}>
            <div className={styles.summaryBox}>
              <SummaryCard
                date={dateLabel}
                dailyRate={dailyRate}
                consumed={consumedKcal}
                forbiddenFoods={forbiddenFoods}
                percentOfNormal={percentOfNormal}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DiaryPage;