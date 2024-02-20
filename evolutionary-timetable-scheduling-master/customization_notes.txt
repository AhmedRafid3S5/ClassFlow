For timetable unique to IUT
*6 slots per day so intotal 30 slots for a class and instructor to go instructor
*each slot represents a time of 1hr 15 mins
*Any course must have 2hr 30 min of class each week, so a lecture class of 1hr 15 min must occur twice in a week
 Similarly a lab will occur once a week for 2hr 30mins
 For now we are not considering bi weekly class modes
 Each department will be assigned a allowed classroom in the input file, need to format it while input from user
*Need to find a way to add a soft constraint that entails that there will not be class after friday jummah -- Update Feb 20th -- Soft constraint implemented. Yay !!
For a lecture that must occur twice, we need to input that lecture info twice for the same section
DO NOT put both section in the same lecture info, this leads to collision that the algorithm cannot resolve.
Update Feb 20th - Added a hard constraint that if classes are of length >= 2, we can't place it in slot 4 (Index 3)

To do
Need a way to check for pre-existing occupancy of classroom and professors so that we can generate timetable one at a time for each semester instead of needing to enter all their class info all at once.