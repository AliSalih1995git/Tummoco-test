require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const authController = require("./controllers/authController");
const passport = require("passport");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");
const { promisify } = require("util");
const path = require("path");

require("./middlware/passport");
const app = express();

// routes & middlewares
const upload = multer({ dest: "uploads/" });
app.use(
  session({
    secret: "ecret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authController);

// const readdirAsync = promisify(fs.readdir);
// const readFileAsync = promisify(fs.readFile);
// const writeFileAsync = promisify(fs.writeFile);
// const unlinkAsync = promisify(fs.unlink);
//upload Files
app.post("/api/files/upload", upload.single("file"), async (req, res) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ error: "No file received" });
    }

    const { userId } = req.body;
    const filePath = `uploads/${userId}_${file.originalname}`;

    await fs.promises.rename(file.path, filePath);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "File processing failed" });
  }
});
//Fetch files
app.get("/api/files", (req, res) => {
  const uploadDirectory = path.join(__dirname, "uploads");

  fs.readdir(uploadDirectory, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read file directory" });
    }

    const imageFiles = files.filter((file) => {
      const extension = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".gif"].includes(extension);
    });

    res.json({ files: imageFiles });
  });
});

app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(200).send({
      user: {
        id: req.user._id,
        username: req.user.username,
      },
    });
  }
);

//DB setup
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Error connecting to mongodb", err));

//server setup
const port = process.env.PORT || 7010;
app.listen(port, () => console.log(`Server running at port ${port}`));
