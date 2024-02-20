def cost(chromosome):
    """
    Cost function for all hard constraints and soft constraint regarding preferred order. All parameters are empirical.
    :param chromosome: Timetable for which we are calculating the cost function.
    :return: Value of cost
    """
    prof_cost = 0
    classrooms_cost = 0
    groups_cost = 0
    subjects_cost = 0

    # Traverse all classes for hard constraints
    for single_class in chromosome[0]:
        time = single_class['Assigned_time']
        class_len = single_class['Length']

        #Adding my custom hard constraint here #Classes of length >= 2 cannot be placed at slot 3
        if time%6 == 3 and int(class_len) >= 2:
            prof_cost += 1
            classrooms_cost += 1
            groups_cost += 1
        
        #Adding custom soft constraint here #So that classes after friday Jummah is avoided as much as possible
        if time > 27 :
            prof_cost += 0.05
            classrooms_cost += 0.05
            groups_cost += 0.05

        # Check hard constraint violation in classes time frame
        for i in range(time, time + int(class_len)):
            if chromosome[1][single_class['Professor']][i] > 1:
                prof_cost += 1
            if chromosome[2][single_class['Assigned_classroom']][i] > 1:
                classrooms_cost += 1
            for group in single_class['Group']:
                if chromosome[3][group][i] > 1:
                    groups_cost += 1
       # here we can add cost for classes of lenght >=2 that fall in slot 4(Index slot 3)
                    
    # Traverse all classes for soft constraint regarding preferred order
    for single_class in chromosome[4]:
        for lab in chromosome[4][single_class]['L']:
            for practice in chromosome[4][single_class]['V']:
                for grupa in lab[1]:
                    if grupa in practice[1] and lab[0] < practice[0]: # If lab is before practical
                        subjects_cost += 0.0025
            for lecture in chromosome[4][single_class]['P']:
                for grupa in lab[1]:
                    if grupa in lecture[1] and lab[0] < lecture[0]: # If lab is before lecture
                        subjects_cost += 0.0025
        for practice in chromosome[4][single_class]['V']:
            for lecture in chromosome[4][single_class]['P']:
                for grupa in practice[1]:
                    if grupa in lecture[1] and practice[0] < lecture[0]: # If practical is before lecture
                        subjects_cost += 0.0025
   # Here we can add soft constraint cost for classes that fall after friday lunch period
    return prof_cost + classrooms_cost + groups_cost + round(subjects_cost, 4)

def cost2(chromosome):
    """
    Cost function for all hard constraints and all soft constraints. All parameters are empirical.
    :param chromosome: Timetable for which we are calculating the cost function.
    :return: Value of cost
    """
    groups_empty = 0
    prof_empty = 0
    load_groups = 0
    load_prof = 0

    # Call function for calculating cost for hard constratins and soft constraint regarding preferred order
    original_cost = cost(chromosome)

    # Calculating idleness and load for groups
    for group in chromosome[3]:
        for day in range(5):
            last_seen = 0
            found = False
            current_load = 0
            for hour in range(6):
                time = day * 6 + hour
                if chromosome[3][group][time] >= 1:
                    current_load += 1
                    if not found:
                        found = True
                    else:
                        groups_empty += (time - last_seen - 1) / 500
                    last_seen = time
            if current_load > 6:
                load_groups += 0.005

    # Calculating idleness and load for professors
    for prof in chromosome[1]:
        for day in range(5):
            last_seen = 0
            found = False
            current_load = 0
            for hour in range(6):
                time = day * 6 + hour
                if chromosome[1][prof][time] >= 1:
                    current_load += 1
                    if not found:
                        found = True
                    else:
                        prof_empty += (time - last_seen - 1) / 2000
                    last_seen = time
            if current_load > 6:
                load_prof += 0.0025

    return original_cost + round(groups_empty, 3) + round(prof_empty, 5) + round(load_prof, 3) + round(load_groups, 4)