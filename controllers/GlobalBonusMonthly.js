const PackageHistory = require("../Models/History/PackageHistory")
const DailyBonus = require("../Models/History/DailyBonus")
const LykaFastBonus = require("../Models/Bonus/LykaFastBonus")
const User = require("../Models/User")
const RankEligibilityClaim = require("../Models/History/RankEligibilityClaim")
const GlobalBonus = require("../Models/Bonus/GlobalBonus")
const GlobalBonusHistory = require("../Models/History/GlobalBonusHistory")
const LykaFastBonusHis = require("../Models/History/LykaFastBonusHis")
const RenewalPurchasePackage = require("../Models/Renewal/RenewalPurchasePackage")
const RebuyBonus = require("../Models/Bonus/RebuyBonus")
const ShortRecord = require("../Models/ShortRecord")
const LapWallet = require("../Models/LapWallet")



// GlobalBonus
// GlobalBonusHistory

exports.GlobalBonusMonthly = async(req, res) => {




  const users = await User.find()


  for (let index = 0; index < users.length; index++) {
   
    var mainUser = users[index]._id
  
  var id = mainUser



  const validateUser = await RankEligibilityClaim.findOne({RankEligibilityClaimOwnerId:id}).sort({_id:-1})

  if (validateUser) {
  

    

  var myDate = new Date()
  
  var myDay = 1
  var myDay2 = myDate.getDate()
  var myMonth = myDate.getMonth()
  var myMonth2 = myDate.getMonth()+1
  var myYear = myDate.getFullYear()

  var start = new Date(myYear, myMonth, myDay);
  var end = new Date(myYear, myMonth2, myDay2);

 


  var TotalBusiness = 0
  
  
  // const RankBonusHistoryData = await RankBonusHistory.find({UpperLineUserId:id,created_on: {$gte: start, $lt: end}})
  const RankBonusHistoryData = await PackageHistory.find({created_on: {$gte: start, $lt: end}})

  
  

  RankBonusHistoryData.map((hit)=>{
      return TotalBusiness = TotalBusiness + Number(hit.PackagePrice)
  })

  


  
  
  // const findMainUserPackage = await User.findById(id)
  const FindRankClaimHis = await RankEligibilityClaim.findOne({RankEligibilityClaimOwnerId:id}).sort({_id:-1})
  
  
  const mainUserPackagePrice = Number(FindRankClaimHis.ClaimedReward)


  
  const rankEligibleForThatPackage = await RankEligibilityClaim.find({ClaimedReward:mainUserPackagePrice})

  console.log("=================================================================================================")



   
  
  // const memberEligible = 1 // this is the count of eligible 
  const memberEligible = rankEligibleForThatPackage.length // this is the count of eligible 
  
  // here we are calculating estimated tokens 

  var percantage = 0
  var star = ""

  if (mainUserPackagePrice == 250) {
      percantage = 2
      star = "1 Star Eligible"
      
  }else if (mainUserPackagePrice == 500) {
      percantage = 1
      star = "2 Star Eligible"
      
  }else if (mainUserPackagePrice == 1000) {
      percantage = 0.5
      star = "3 Star Eligible"

  }else if (mainUserPackagePrice == 2500) {
      percantage = 0.3
      star = "4 Star Eligible"

    }else if (mainUserPackagePrice == 5000) {
      percantage = 0.2
      star = "5 Star Eligible"
      
    }else if (mainUserPackagePrice == 10000) {
      percantage = 0.1
      star = "6 Star Eligible"
      
    }else if (mainUserPackagePrice == 25000) {
      percantage = 0.1
      star = "7 Star Eligible"

  }else if (mainUserPackagePrice == 50000) {
    percantage = 0.1
      star = "8 Star Eligible"

  }
  

  console.log("Percantage Given ===> "+percantage)

  console.log("TotalBusiness ===> "+TotalBusiness)
  
  
  var est1 = Number(TotalBusiness) * percantage /100
  
  console.log("Estimated ===> "+est1)


  console.log("eligibial members ===> "+Number(memberEligible))
  console.log("Give Reward ===> "+Number(est1)/Number(memberEligible))
  var givre = Number(est1)/Number(memberEligible)


  const esDate = new Date(start)













      const makeSingleHistory = await GlobalBonus({

        BonusOwner: id,
        Percantage: percantage


      }).save()



    }

















    const userDataid = await User.findById(id)
    const FindPackage = await PackageHistory.findOne({ PackageOwner: id })

    const Max_Cap = Number(FindPackage.PackagePrice) * 300 / 100

    console.log("Max_Cap => " + Max_Cap)

    const Got_Reward = Number(givre)

    console.log("Got_Reward => " + Got_Reward)
    const My_Wallet = Number(userDataid.MainWallet)
    console.log("My_Wallet => " + My_Wallet)
    console.log("came in first")


    if (Got_Reward + My_Wallet >= Max_Cap) {

      var Add_Money_In_Wallet = Max_Cap - My_Wallet

      const Lap_Income = Got_Reward > Add_Money_In_Wallet ? Got_Reward - Add_Money_In_Wallet : Add_Money_In_Wallet - Got_Reward

      const fetch_Last_Lap_Wallet = await LapWallet.findOne({ BonusOwner: id })

      if (fetch_Last_Lap_Wallet) {

        await LapWallet.findByIdAndUpdate({ _id: fetch_Last_Lap_Wallet._id }, { LapAmount: fetch_Last_Lap_Wallet.LapAmount + Lap_Income })

      } else {

        await LapWallet({
          BonusOwner: id,
          LapAmount: Lap_Income
        }).save()

      }

      const makeGlobalHistory = await GlobalBonusHistory({

        Owner: id,
        Coins:givre,
        Percantage: Got_Reward,
        CompanyBusiness:TotalBusiness
  
      }).save()

    } else {

      var Add_Money_In_Wallet = Got_Reward + My_Wallet

      const makeGlobalHistory = await GlobalBonusHistory({

        Owner: id,
        Coins:Add_Money_In_Wallet,
        Percantage: percantage,
        CompanyBusiness:TotalBusiness
  
      }).save()
    }























    // short record

    const findShortRecord = await ShortRecord.findOne({RecordOwner:id})


    console.log(givre)





    if (findShortRecord) {

      let sum = (parseFloat(findShortRecord.GobalPoolBonus) + parseFloat(givre)).toFixed(2)
     
      console.log(sum)
      console.log(typeof(sum))

      const updateValue = await ShortRecord.findByIdAndUpdate({_id:findShortRecord._id},{GobalPoolBonus:sum})

    }else{

      const createShortRecord = await ShortRecord({
        RecordOwner:id,
        GobalPoolBonus:Number(givre).toFixed(2)
      }).save()

    }



  
  
  
  
  
  
}
  
  



  return res.json('Done :)')
  


}
