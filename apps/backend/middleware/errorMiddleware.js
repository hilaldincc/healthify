const errorHandler = (err, req, res, next) => {
  // CORS başlıklarını hata durumunda da elle ekle

  // CORS başlıklarını manuel olarak ekle
  // Bu, hata oluştuğunda bile tarayıcının yanıtı kabul etmesini sağlar
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export { errorHandler };
