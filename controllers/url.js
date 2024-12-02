// here we use shortid from the npm js website , it is like a package which generates short ids 
// const shortid = require("shortid");
// const URL = require("../models/url");

// async function  handleGenerateNewShortUrl(req ,res){
//    const body = req.body;
//    if(!body.url) return res.status(400).json({ error : "Insert an url"})
//    const shortID = shortid();
   
//    await URL.create({
//     shortId : shortID,
//     redirectURL : body.url,
//     visitHistory : [],
//    });

//    return res.json({id: shortID});
//   }
// module.exports = {
//   handleGenerateNewShortUrl,
// }

// changing the controller to use the model 

const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortUrl(req, res) {
  const { redirectUrl } = req.body;

  // Check if `redirectUrl` is provided
  if (!redirectUrl) {
    return res.status(400).json({ error: "Please provide a redirect URL" });
  }

  try {
    const shortId = shortid.generate();

    // Create a new document in the database
    const newUrl = await URL.create({
      shortId: shortId,
      redirectUrl: redirectUrl,
      visitHistory: [],
    });

    return res.status(201).json(newUrl);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}

// for analytics of the url
async function handleGetAnalytics(req ,res){
  const shortId = req.params.shortId;
  const result = await URL.findOne({shortId});

  return res.json({
    totalClicks : result.visitHistory.length,
    analytics : result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortUrl,
  handleGetAnalytics,
};
