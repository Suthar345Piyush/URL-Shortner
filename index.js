const express = require("express");
const urlRoute = require("./routes/url");
const {connectToMongoDB} = require("./connection");
const app = express();
const PORT = 8000;


connectToMongoDB("mongodb://localhost:27017/short-url").then(() => console.log("Mongodb connected!!"));

app.use(express.json()); 
app.use("/url" , urlRoute);

app.get("/:shortId" , async (req , res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate({
    shortId,
  } , {$push : {
    visitHistory : {
      timestamp  : Date.now(),
    },
  }});
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`server started at port :${PORT}`));

