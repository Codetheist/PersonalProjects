# 100 Days of OF Code: Python
# Day 5 - Create a Password Generator

import random

# Create a list of letters, numbers, and symbols
letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "+"]

# Ask the user how many letters, numbers, and symbols they want in their password
print(f"Welcome to the Password Generator!")
num_letters = int(input(f"How many letters would you like in your password? "))
num_numbers = int(input(f"How many numbers would you like in your password? "))
num_symbols = int(input(f"How many symbols would you like in your password? "))
print(f"Your password will have {num_letters} letters, {num_numbers} numbers, and {num_symbols} symbols.")

# Create a list to store the password
password = []

# Add the letters, numbers, and symbols to the password list
for i in range(1, num_letters + 1):
    password.append(random.choice(letters))

for i in range(1, num_numbers + 1):
    password.append(random.choice(numbers))

for i in range(1, num_symbols + 1):
    password.append(random.choice(symbols))

# Shuffle the password list
random.shuffle(password)

# Convert the password list into a string
password = "".join(password)

# Print the password
print(f"Your password is: {password}")