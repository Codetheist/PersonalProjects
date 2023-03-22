# Calculator - A simple calculator to do basic operators.
# Make it a scientific calculator for added complexity.
# It then returns the tax plus the total cost with tax.
# Author: Codetheist
# Company: Codetheist, LLC
# Email: codetheist@codetheist.com


def calculator():
    print("Which type of calculator do you want to use?\n")
    print("1. Standard")
    print("2. Scientific")
    print("Q. Quit")

    user_input = input("Select an option: ")
    quit = "Q"
    while user_input.upper() != quit:
        if (user_input == "1"):
            standard_calculator()
            print("\nWhich type of calculator do you want to use?\n")
            print("1. Standard")
            print("2. Scientific")
            print("Q. Quit")
            user_input = input("Select an option: \n")
        # elif (user_input == 2):
            # scientific_calculator()


def standard_calculator():

    num1 = float(input("Enter the first number: "))
    operator = input("Operator: ")
    num2 = float(input("Enter the second number: "))
    solution = 0.0

    if operator == "+":
        solution = num1 + num2
    elif operator == "-":
        solution = num1 - num2
    elif operator == "*":
        solution = num1 * num2
    elif operator == "/":
        solution = num1 / num2
    else:
        print("Invalid operator. Please select a operator")

    print(f"{num1} {operator} {num2} equals {solution}")


# def scientific_calculator():
    #


calculator()
