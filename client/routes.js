// *********************** ((Auth)) ***************************** //
1 - register;
2 - login;
3 - logout;
4 - profile;

// *********************** ((User)) ***************************** //
1 - update;
2 - getSingleUser;
3 - getMyPaidCourses;
4- getAllUsers -> ADMIN


// *********************** ((Courses)) ***************************** //
1- create -> ADMIN
2- update -> ADMIN
3- delete -> ADMIN
4- getAll 
5- getSingleById 
6- searchByTitle

// *********************** ((Sections)) ***************************** //
1- create -> ADMIN
2- update -> ADMIN
3- delete -> ADMIN
4- getAllSectionForCourse (courseId) 

// *********************** ((Videos)) ***************************** //
1- create -> ADMIN
2- update -> ADMIN
3- delete -> ADMIN
4- getAllVideosForSection (sectionId) 

// *********************** ((Files)) ***************************** //
1- create -> ADMIN
2- update -> ADMIN
3- delete -> ADMIN
4- getAllFilesForSection (sectionId) 





// *********************** ((Quizzes)) ***************************** //
1- create -> ADMIN
2- update -> ADMIN
3- delete -> ADMIN
4-getAllQuizes -> ADMIN
5- 🎯🧠 getAllQuizesForSpecificClssename ⭐✨



// *********************** ((Questions)) ***************************** //
1- create -> ADMIN
2- update -> ADMIN
3- delete -> ADMIN
4- getAllQuestionsForSpecificQuiz (QuizzesId)



// *********************** ((Options)) ***************************** //
1- create -> ADMIN
2- update -> ADMIN
3- delete -> ADMIN
4- getAllOptionsForSpecificQuestion (QuestionsId)

// *********************** ((User Answer)) ***************************** //
1- 

// *********************** ((Reviews)) ***************************** //
1- create -> after paid status (PAID)
2- delete -> ADMIN
3- getAllReviews (CourseId)


// *********************** ((Payments)) ***************************** //
1- pay
2- getPayment (useId)
