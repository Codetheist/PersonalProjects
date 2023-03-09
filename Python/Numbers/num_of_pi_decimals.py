# Find PI to the Nth Digit - Enter a number and have the program generate PI up to that many decimal places.
# Keep a limit to how far the program will go.
# Author: Codetheist
# Company: Codetheist, LLC
# Email: codetheist@codetheist.com

import math

print("PI generator to the Nth digit\n")


def pi_to_the_nth_digit():
    num_digits = int(input("How many digits: "))

    PI = math.pi

    # pi_calc =

    print(f"PI to the {num_digits}th digit is amount: %.{num_digits}f")


pi_to_the_nth_digit()
