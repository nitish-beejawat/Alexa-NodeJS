const PackageHistory = require("../Models/History/PackageHistory")
const DailyBonus = require("../Models/History/DailyBonus")
const LykaFastBonus = require("../Models/Bonus/LykaFastBonus")
const User = require("../Models/User")
const LykaFastBonusHis = require("../Models/History/LykaFastBonusHis")
const RenewalPurchasePackage = require("../Models/Renewal/RenewalPurchasePackage")
const RebuyBonus = require("../Models/Bonus/RebuyBonus")
const ShortRecord = require("../Models/ShortRecord")


exports.homes = async(req, res) => {

  var list = []

  const findPackage = await PackageHistory.find()


  if (findPackage.length == 0) {
    return res.json("no any user found")
  }

  findPackage.map(hit => {
    return list.push({ id: hit.PackageOwner, price: hit.PackagePrice, name: hit.PackageName })
  })

  for (let i = 0; i < list.length; i++) {





    const myOldWallet = await User.findById(list[i].id)

    const investedAmount = list[i].price

    var findFastBonus = await LykaFastBonus.find({ FastBonusCandidate: list[i].id })

    const findRenewalBonus = await RenewalPurchasePackage.findOne({PackageOwner:list[i].id})


    var per = 0.3

    var FindMainUserReferals = []



   
    if (findFastBonus.length !== 0) {
      var totLenght = findFastBonus[0].ReferLength

      const findMainUser = findFastBonus[0].FastBonusCandidate

      const findUserPackage = await PackageHistory.findOne({PackageOwner:findMainUser})


      const MainUserPackagePrice = findUserPackage.PackagePrice 

  

      FindMainUserReferals = await User.find({UpperlineUser:findMainUser,PurchasedPackagePrice:  { $gte: Number(MainUserPackagePrice) } })




      if (FindMainUserReferals.length == 2 || FindMainUserReferals.length == 3) {
        per = 1
     
      }else if(FindMainUserReferals.length == 4 || FindMainUserReferals.length == 5){
        per = 2
       
      }else if(FindMainUserReferals.length == 6 || FindMainUserReferals.length == 7){
        per = 3
    
      }else if(FindMainUserReferals.length == 8 || FindMainUserReferals.length == 9){
        per = 4
        
      }else if(FindMainUserReferals.length >= 10){
        per = 5
      
      }

      



      if (findRenewalBonus==null) {      
        
      }else if(findRenewalBonus!==null&&findRenewalBonus.DirectReferalDone == "false"){
       
        per = 0.3
      }else if(findRenewalBonus.DirectReferalDone == "false"){
     
        per = 0.3
      }else{
       
      }


    }



    var finalCal = (Number(investedAmount) * per) / 100

    var refDef = finalCal*3/100


    var myWallete = myOldWallet.MainWallet

    var finalWallete = Number(myWallete) + Number(finalCal)

    await User.findByIdAndUpdate({ _id: list[i].id }, { MainWallet: finalWallete })

    console.log("working till here")

    
    
    if (myOldWallet.UpperlineUser !== "null") {
      const upperlineUserData = await User.findById(myOldWallet.UpperlineUser)


      console.log("the user is => "+myOldWallet._id)
      const FindPackagesforThis = await PackageHistory.findOne({PackageOwner:myOldWallet._id})


      if (FindPackagesforThis.Type == "Repurchased") {
        
      
      if (Number(myOldWallet.PurchasedPackagePrice) > 0) {
  
        const GiveReawdToUpperUpper = await RebuyBonus({
          BonusOwner:upperlineUserData._id,
          ReferSentFromId:myOldWallet._id,
          ReferSentFromUserId:myOldWallet.UserName,
          ReferGetFromId:upperlineUserData._id,
          ReferGetFromUserId:upperlineUserData.UserName,
          PackName:upperlineUserData.PurchasedPackageName,
          EarnedRewardCoins:Number(refDef).toFixed(2)
        }).save()





        const findShortRecord = await ShortRecord.findOne({RecordOwner:upperlineUserData._id})


        if (findShortRecord) {
    
          let sum = (parseFloat(findShortRecord.RebuyBonus) + parseFloat(refDef)).toFixed(2)
         
          console.log(sum)
          console.log(typeof(sum))
    
          const updateValue = await ShortRecord.findByIdAndUpdate({_id:findShortRecord._id},{RebuyBonus:sum})
    
        }else{
    
          const createShortRecord = await ShortRecord({
            RecordOwner:uplineUser,
            RebuyBonus:Number(refDef).toFixed(2)
          }).save()
    
        }
















      }

    }


    }







    if (findRenewalBonus!==null&& findRenewalBonus.DirectReferalDone == "true") {

      if (FindMainUserReferals.length >= 2 ) {
        const createRecord = await LykaFastBonusHis({
          BonusOwner: list[i].id,
          FormPackage: list[i].name,
          PackagePercantage: per,
          Amount: finalCal
        }).save()



        const findShortRecord = await ShortRecord.findOne({RecordOwner:list[i].id})


        if (findShortRecord) {

          let sum = Number(findShortRecord.PowerStaing) + Number(finalCal)

          const updateValue = await ShortRecord.findByIdAndUpdate({_id:findShortRecord._id},{PowerStaing:sum})

        }else{

          const createShortRecord = await ShortRecord({
            RecordOwner:list[i].id,
            PowerStaing:finalCal
          }).save()

        }










      } else {
        const createRecord = await DailyBonus({
          BonusOwner: list[i].id,
          FormPackage: list[i].name,
          PackagePercantage: per,
          Amount: finalCal
        }).save()



        const findShortRecord = await ShortRecord.findOne({RecordOwner:list[i].id})


        if (findShortRecord) {

          let sum = Number(findShortRecord.DailyStakig) + Number(finalCal)

          const updateValue = await ShortRecord.findByIdAndUpdate({_id:findShortRecord._id},{DailyStakig:sum})

        }else{

          const createShortRecord = await ShortRecord({
            RecordOwner:list[i].id,
            DailyStakig:finalCal
          }).save()

        }


        // const GiveReawdToUpperUpper = await RebuyBonus({
        //   BonusOwner:upperlineUserData._id,
        //   ReferSentFromId:myOldWallet._id,
        //   ReferSentFromUserId:myOldWallet.UserName,
        //   ReferGetFromId:upperlineUserData._id,
        //   ReferGetFromUserId:upperlineUserData.UserName,
        //   PackName:upperlineUserData.PurchasedPackageName,
        //   EarnedRewardCoins:refDef
        // }).save()
      }


    }else{
      if (FindMainUserReferals.length >= 2 ) {
        const createRecord = await LykaFastBonusHis({
          BonusOwner: list[i].id,
          FormPackage: list[i].name,
          PackagePercantage: per,
          Amount: finalCal
        }).save()


        const findShortRecord = await ShortRecord.findOne({RecordOwner:list[i].id})


        if (findShortRecord) {

          let sum = Number(findShortRecord.PowerStaing) + Number(finalCal)

          const updateValue = await ShortRecord.findByIdAndUpdate({_id:findShortRecord._id},{PowerStaing:sum})

        }else{

          const createShortRecord = await ShortRecord({
            RecordOwner:list[i].id,
            PowerStaing:finalCal
          }).save()

        }






      } else {
        const createRecord = await DailyBonus({
          BonusOwner: list[i].id,
          FormPackage: list[i].name,
          PackagePercantage: per,
          Amount: finalCal
        }).save()


        const findShortRecord = await ShortRecord.findOne({RecordOwner:list[i].id})


        if (findShortRecord) {

          let sum = Number(findShortRecord.DailyStakig) + Number(finalCal)

          const updateValue = await ShortRecord.findByIdAndUpdate({_id:findShortRecord._id},{DailyStakig:sum})

        }else{

          const createShortRecord = await ShortRecord({
            RecordOwner:list[i].id,
            DailyStakig:finalCal
          }).save()

        }







      }
    }


    console.log('done')
  }

  res.json(list)




}
