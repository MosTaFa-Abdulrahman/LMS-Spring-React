// *********************** ((Users)) ***************************** //
firstName,
lastName,
username unique,
email unique,
password,
phone,
fatherPhone,
className enum,
profilePic

// *********************** ((Courses)) ***************************** //
courseImg,
title,
description,
userId


// *********************** ((Sections)) ***************************** //
title,
price,
description,
totalHours,
courseId

// *********************** ((Videos)) ***************************** //
title,
videoUrl,
totalHours,
sectionId


// *********************** ((Files)) ***************************** //
title,
fileUrl,
sectionId

// *********************** ((Quizzes)) ***************************** //
imgUrl,
title,
className enum,
description,
startDate,
endDate,
userId,
courseId


// *********************** ((Questions)) ***************************** //
title,
point,
imgUrl,
quizId



// *********************** ((Options)) ***************************** //
title:string,
correctAnswer:Boolean, 
questionId


// *********************** ((UserAnswer)) ***************************** //
answeredAt: DateTime,
isCorrect: Boolean,
pointsEarned: Double,
userId,
questionId,
optionId



// *********************** ((Reviews)) ***************************** //
description,
stars:number enum 1:5,
courseId
userId


// *********************** ((Payments)) ***************************** //
userId,
courseId,
sectionId, 30
amountPaid,
status:(PAID,PARTIAL_PAID)




// *********************** ((Posts 🤞)) ***************************** //


