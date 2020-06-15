const express = require("express");
const { Profile } = require("../models/profile");
const { Superpower } = require("../models/superpower");
const { Weakness } = require("../models/weakness");
const router = express.Router();

const sortAlgorithm = sorting => {
  if (sorting == 1) return {};
  else if (sorting == 2) return { name: 1 };
  else if (sorting == 3) return { name: -1 };
  else if (sorting == 4) return { superpowers: 1 };
  else return {};
};

router.get("/list/:page/:sorting", async (req, res) => {
  const pageNumber = req.params.page || 1;
  const pageSize = 20;
  const count = await Profile.countDocuments();
  const sort = sortAlgorithm(req.params.sorting);
  const profiles = await Profile.find({})
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort(sort);
  const pageobj = {
    profiles,
    currentPage: pageNumber,
    pages: Math.ceil(count / pageSize),
    count
  };
  res.send(pageobj);
});

router.get("/search/:query", async (req, res) => {
  const { query } = req.params;
  const profiles = await Profile.find({
    $or: [
      { name: new RegExp(query, "i") },
      { location: new RegExp(query, "i") }
    ]
  })
    .limit(5)
    .select({
      name: () => {
        if (name) return name;
      },
      location: () => {
        if (location) return location;
      },
      profileImg: () => {
        if (profileImg) return profileImg;
      }
    });
  res.send(profiles);
});

router.get(
  "/search-by-name-and-superpower/:query/:page/:sorting",
  async (req, res) => {
    const { query, page, sorting } = req.params;
    const pageNumber = page || 1;
    const pageSize = 20;
    const count = await Profile.find({
      $or: [
        {
          name: new RegExp(query, "i")
        },
        { superpowers: { $elemMatch: { name: new RegExp(query, "i") } } }
      ]
    });
    const sort = sortAlgorithm(req.params.sorting);
    const profiles = await Profile.find({
      $or: [
        {
          name: new RegExp(query, "i")
        },
        { superpowers: { $elemMatch: { name: new RegExp(query, "i") } } }
      ]
    })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort(sort);

    const pageobj = {
      profiles,
      currentPage: pageNumber,
      pages: Math.ceil(count / pageSize),
      count
    };
    res.send(pageobj);
  }
);

router.put("/star-profile/:userId", async (req, res) => {
  const { userId } = req.params;
  const { star } = req.body;
  const profile = await Profile.findByIdAndUpdate(
    userId,
    { star },
    { new: true }
  );
  profile.save();
  res.send(true);
});

router.put("/add-superpower/:userId", async (req, res) => {
  const { userId } = req.params;
  const { _id } = req.body;
  const superpower = await Superpower.findById({ _id });
  const profile = await Profile.findById(userId);
  const profileSuperPowers = profile.superpowers;
  profile.superpowers = [...profileSuperPowers, superpower];
  profile.save();
  const data = profile.superpowers[profile.superpowers.length - 1];
  res.send(data);
});

router.put("/add-weakness/:userId", async (req, res) => {
  const { userId } = req.params;
  const { _id } = req.body;
  const weakness = await Weakness.findById({ _id });
  const profile = await Profile.findById(userId);
  const profileWeaknesses = profile.weaknesses;
  profile.weaknesses = [...profileWeaknesses, weakness];
  profile.save();
  const data = profile.weaknesses[profile.weaknesses.length - 1];
  res.send(data);
});

router.delete("/delete-weakness/:profileId/:charId", async (req, res) => {
  const { profileId, charId } = req.params;
  const profile = await Profile.findOne({ _id: profileId });
  profile.weaknesses = profile.weaknesses.filter(wn => wn._id != charId);
  profile.save();
  res.send(true);
});

router.delete("/delete-superpower/:profileId/:charId", async (req, res) => {
  const { profileId, charId } = req.params;
  const profile = await Profile.findOne({ _id: profileId });
  profile.superpowers = profile.superpowers.filter(wn => wn._id != charId);
  profile.save();
  res.send(true);
});

router.delete("/delete-company/:profileId/:companyId", async (req, res) => {
  const { profileId, companyId } = req.params;
  const profile = await Profile.findOne({ _id: profileId });
  profile.companies = profile.companies.filter(cm => cm._id != companyId);
  profile.save();
  res.send(true);
});

router.put("/update-socail-media/:userId", async (req, res) => {
  const { userId } = req.params;
  const { facebook, instagram, twitter, linkedIn } = req.body;

  await Profile.findByIdAndUpdate(userId, {
    facebook,
    instagram,
    twitter,
    linkedIn
  });

  res.send(true);
});

router.put("/update-profile/:userId", async (req, res) => {
  const { userId } = req.params;
  const { profileImg, name, location, emails, phones, bio } = req.body;
  await Profile.findByIdAndUpdate(userId, {
    profileImg,
    name,
    location,
    emails,
    phones,
    bio
  });

  res.send(true);
});

router.delete("/delete-company/:profileId/:companyId", async (req, res) => {
  const { profileId, companyId } = req.params;
  const profile = await Profile.findByIdAndUpdate(
    profileId,
    {
      $pull: { companies: companyId }
    },
    { new: true }
  );
  res.send(profile);
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const profile = await Profile.findById(userId).populate("companies");
  res.send(profile);
});

router.post("/", async (req, res) => {
  const {
    profileImg,
    name,
    location,
    emails,
    phones,
    bio,
    superpowers,
    weaknesses
  } = req.body;

  const profile = new Profile({
    profileImg,
    name,
    location,
    emails,
    phones,
    bio,
    superpowers,
    weaknesses
  });
  try {
    await profile.save();
    res.send(profile._id);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.send(err);
  }
});

router.delete("/:profileId", async (req, res) => {
  const { profileId } = req.params;
  try {
    await Profile.findByIdAndDelete({ _id: profileId });
    res.send(true);
  } catch (err) {
    res.send(false);
  }
});

module.exports = router;
