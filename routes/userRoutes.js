const express = require("express")
const { homes } = require("../controllers/DailyReward")
const { MatchingBonus } = require("../controllers/MatchingBonus")
const { GlobalBonusMonthly } = require("../controllers/GlobalBonusMonthly")
const { ClaimRankEligibility } = require("../controllers/ClaimRankEligibility")
const { CountMyTeam } = require("../controllers/CountMyTeam")
const router = express.Router();

router.post("/dailyBonus", homes)
router.post("/matchiingBonus", MatchingBonus)
router.post("/globalBonusMonthly", GlobalBonusMonthly)
router.post("/ClaimRankEligibility", ClaimRankEligibility)
router.post("/CountMyTeam", CountMyTeam)





module.exports = router;