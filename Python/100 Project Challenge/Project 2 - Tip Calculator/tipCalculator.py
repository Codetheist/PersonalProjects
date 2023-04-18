# 100 Days of OF Code: Python
# Day 2 - Tip Calculator

print(f"Welcome to the tip calculator.")
total_bill = float(input(f"What was the total bill? $"))
total_people = int(input(f"How many people to split the bill? "))
tip = int(input(f"What percentage tip would you like to give? 10, 12, or 15? "))
person_bill = (total_bill + (total_bill * (tip / 100))) / total_people
print(f"Each person should pay: ${person_bill:.2f}")
