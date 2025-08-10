const User = require("../models/User");
const Capsule = require("../models/Capsule");

exports.getStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const capsulesCreatedCount = await Capsule.countDocuments();
    const capsulesOpenedCount = await Capsule.countDocuments({ openedAt: { $ne: null } });

    res.json({
      users: usersCount,
      capsulesCreated: capsulesCreatedCount,
      capsulesOpened: capsulesOpenedCount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
