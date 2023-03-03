const express = require("express")
const { homes } = require("../controllers/DailyReward")
const { MatchingBonus } = require("../controllers/MatchingBonus")
const { GlobalBonusMonthly } = require("../controllers/GlobalBonusMonthly")
const { ClaimRankEligibility } = require("../controllers/ClaimRankEligibility")
const { CountMyTeam } = require("../controllers/CountMyTeam")

// Imported Splitted API Endpoints

const { DailyReward1 } = require("../controllers/SplittedApi/DailyReward1")
const { DailyReward2 } = require("../controllers/SplittedApi/DailyReward2")
const { DailyReward3 } = require("../controllers/SplittedApi/DailyReward3")
const { DailyReward4 } = require("../controllers/SplittedApi/DailyReward4")
const { DailyReward5 } = require("../controllers/SplittedApi/DailyReward5")
const { DailyReward6 } = require("../controllers/SplittedApi/DailyReward6")
const { DailyReward7 } = require("../controllers/SplittedApi/DailyReward7")
const { DailyReward8 } = require("../controllers/SplittedApi/DailyReward8")
const { DailyReward9 } = require("../controllers/SplittedApi/DailyReward9")
const { DailyReward10 } = require("../controllers/SplittedApi/DailyReward10")




const router = express.Router();

router.post("/dailyBonus", homes)
router.post("/matchiingBonus", MatchingBonus)
router.post("/globalBonusMonthly", GlobalBonusMonthly)
router.post("/ClaimRankEligibility", ClaimRankEligibility)
router.post("/CountMyTeam", CountMyTeam)


// Splitted API Endpoints


router.post("/Splitted/DailyReward1", DailyReward1)
router.post("/Splitted/DailyReward2", DailyReward2)
router.post("/Splitted/DailyReward3", DailyReward3)
router.post("/Splitted/DailyReward4", DailyReward4)
router.post("/Splitted/DailyReward5", DailyReward5)
router.post("/Splitted/DailyReward6", DailyReward6)
router.post("/Splitted/DailyReward7", DailyReward7)
router.post("/Splitted/DailyReward8", DailyReward8)
router.post("/Splitted/DailyReward9", DailyReward9)
router.post("/Splitted/DailyReward10", DailyReward10)


module.exports = router;