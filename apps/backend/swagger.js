import fs from "fs";

// JSON dosyasını okuyup parse et
// NOT: Bu dosya okuma işlemi, synchronous (blocking) olduğu için sadece başlangıçta kullanılır.
const file = fs.readFileSync("./swagger.json", "utf8");
const specs = JSON.parse(file);

export default specs;
