import json
import random

#Global variables
 #Variables to store occupancy or pre existing routine for professors,groups & rooms
load_list_prof = {}
load_list_rooms = {}
load_list_groups = {}
        
#To Do: def load_occupancy_data(path):
def load_occupancy_data(path,professor_load_list,rooms_load_list,groups_load_list):
    with open(path, 'r') as read_file:
        data = json.load(read_file)
    professor_load_list.update(data['Professors'])
    rooms_load_list.update(data['Rooms'])
    groups_load_list.update(data['Groups'])



def save_occupancy_data(path,professor_load_list,rooms_load_list,groups_load_list):
    data = {'Professors':{},'Rooms':{},'Groups':{}}
    data['Professors'] = professor_load_list
    data['Rooms'] = rooms_load_list
    data['Groups'] = groups_load_list

    with open(path,'w') as write_file:
        json.dump(data,write_file,indent=4)



def load_data(path):
    with open(path, 'r') as read_file:
        data = json.load(read_file)

    for university_class in data['Classes']:
        classroom = university_class['Classroom']
        university_class['Classroom'] = data['Classrooms'][classroom]

    data = data['Classes']

    return data

def generate_chromosome(data):
    professors = {}
    classrooms = {}
    groups = {}
    subjects = {}

   

    new_data = []

  
    input_file = r'frontend\src\evolutionary-timetable-scheduling-master\classes\occupancy.json'

    load_occupancy_data(input_file,load_list_prof,load_list_rooms,load_list_groups)
    
    #debug lines..
    """
    if(len(load_list_prof) != 0):
      print('loaded successfully from internal function')
    """

    for single_class in data:
        professors[single_class['Professor']] = [0] * 30
        for classroom in single_class['Classroom']:
            classrooms[classroom] = [0] * 30
        for group in single_class['Group']:
            groups[group] = [0] * 30
        subjects[single_class['Subject']] = {'P' : [], 'V' : [], 'L' : []}

    for single_class in data:
        new_single_class = single_class.copy()

        classroom = random.choice(single_class['Classroom'])
        day = random.randrange(0, 5)
        if day == 4:
            period = random.randrange(0, 6 - int(single_class['Length']))
        else:
            period = random.randrange(0, 7 - int(single_class['Length']))
        new_single_class['Assigned_classroom'] = classroom
        time = 6 * day + period
        new_single_class['Assigned_time'] = time

        for i in range(time, time + int(single_class['Length'])):
            professors[new_single_class['Professor']][i] += 1
            classrooms[classroom][i] += 1
            for group in new_single_class['Group']:
                groups[group][i] += 1
        subjects[new_single_class['Subject']][new_single_class['Type']].append((time, new_single_class['Group']))
        
        #add weight according to pre existing occupancy
        #If occupied, increment that time slot for that prof and classroom by one
        for i in range(time, time + int(single_class['Length'])):
            if(new_single_class['Professor'] in load_list_prof):
                professors[new_single_class['Professor']][i] += load_list_prof[new_single_class['Professor']][i]
            if(group in load_list_groups):
                for group in new_single_class['Group']:
                    groups[group][i] += load_list_groups[group][i]
            if(classroom in load_list_rooms):
                classrooms[classroom][i] += load_list_rooms[classroom][i]

        new_data.append(new_single_class)
        
    return (new_data, professors, classrooms, groups, subjects)

def write_data(data, path):
    with open(path, 'w') as write_file:
        json.dump(data, write_file, indent=4)