# Fizz Buzz - Write a program that prints the numbers from 1 to 100.
# But for multiples of three print “Fizz” instead of the number
# and for the multiples of five print “Buzz”.
# For numbers which are multiples of both three and five print “FizzBuzz”.
# Author: Codetheist
# Date created: 2/19/2021
# Company: Codetheist, LLC
# Email: codetheist@codetheist.com

print("Fizz Buzz Print Out!")


def fizz_bizz():
    max_number = 100
    min_number = 0

    while min_number < max_number:

        min_number += 1

        if min_number % 3:
            print('Fizz')

        elif min_number % 5:
            print('Buzz')

        elif min_number % 3 and min_number % 5:
            print('FizzBuzz')

        print(min_number)


fizz_bizz()
