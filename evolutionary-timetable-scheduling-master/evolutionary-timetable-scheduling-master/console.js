// import exec function from child_process module and assign it to exec 
const {exec } = require('child_process')

const pythonScriptPath = './evolutionary-timetable-scheduling-master/algorithm.py';

//Execute the python script, will wrap it inside a conditional statement when implementing so when a generate button is pressed, this algorithm is 
//executed
const chilProcess = exec(`python ${pythonScriptPath}`, (error,stdout,stderr) => {
    if(error){
      console.log(`Error: ${error.message}`)
      return
    }

    if(stderr){
      console.log(`Python script stderr: ${stderr}`)
      return
    }

    console.log(`Python script console log: ${stdout}`)
})

chilProcess.on('error', (error) => {
    console.error(`Error executing script : ${error.message}`)
})


//A rudimentary routine format
console.log("          0/6/12/18/24 | 1/7/13/19/25 | 2/8/14/20/26  | 3/9/15/21/27 |           | 4/10/16/22/28 | 5/11/17/23/29")
console.log("          --------------------------------------------------------------------------------------------------------")
console.log("          8 - 9:15     | 9-15 - 10:30 | 10:30 - 11:15 | 11:15 - 1:00 |## Lunch ##| 2:30 - 3:45   | 3:45 - 5     |")
console.log("          --------------------------------------------------------------------------------------------------------")

const sample = require('./classes/output0.json');
//console.log(sample);

let timetable = [[],[],[],[],[],[],[],[],[],[],
                 [],[],[],[],[],[],[],[],[],[],
                 [],[],[],[],[],[],[],[],[],[]];

for( i = 0; i<sample.length;i++)
{
    const assignedTime = sample[i].Assigned_time;
    if (!timetable[assignedTime]) {
        // If not, create a new array for this assigned time
        timetable[assignedTime] = [];
    }
   timetable[sample[i].Assigned_time].push(sample[i]); 
}




// Initialize an array to store the names of days
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Iterate over each time slot for each day
for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
    const day = days[dayIndex];
    let dayTimetable = timetable.slice(dayIndex * 6, (dayIndex + 1) * 6);

    // Print the name of the day
    process.stdout.write(day + " : ");

    // Iterate over each time slot for the current day
    dayTimetable.forEach((timeSlot, index) => {

        // Print the details of each class in the time slot
        if(timeSlot.length == 0)
        {
            process.stdout.write("______________");
        }
        else{
        timeSlot.forEach((classDetails, classIndex) => {
            
            process.stdout.write(`${classDetails.Subject},${classDetails.Group},${classDetails.Assigned_time} ,`);
            if (classIndex == timeSlot.length - 1) {
                process.stdout.write(" | "); // Separate classes within the same time slot
            }
        });
        if (index < dayTimetable.length - 1) {
            process.stdout.write(" | "); // Separate time slots within the same day
        }
    }
    
    });
    console.log(); // Move to the next line for the next day

}
// Iterate over each time slot for each day

const fs = require('fs');

function writeData(data, path) {
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
}

const data = timetable;
const path = 'processedTimetable.json';
writeData(data,path);




