const errorHandler = (err, req, res, next) => {
  // Eğer status kodu 200 ise (başarılı kabul edilmesin diye) 500 yap
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status);

  res.json({
    message: err.message,
    // Yığılma izini (stack trace) sadece geliştirme ortamında göster
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export { errorHandler };
