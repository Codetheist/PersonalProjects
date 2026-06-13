from datetime import date

current_year = date.today().year

birth_year = int(input("Enter your birth year: "))

age = current_year - birth_year

print(age)

'''from datetime import date

def years_calculate():
  current_year = date.today().year
  
  if (current_year % 4):
    
    birth_year = int(input("Enter your birth your: "))

    age = current_year - birth_year
    
    leap_year = (current_year % 4) + age

    return leap_year

  else:
    
    age = current_year - birth_year
    
    return age


years_calculate()'''
