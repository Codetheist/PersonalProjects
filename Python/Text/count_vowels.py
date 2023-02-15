# Count Vowels - Enter a string and the program counts the number
# of vowels in the text.
# For added complexity have it report a sum of each vowel found.
# Author: Codetheist
# Date created: 2/19/21
# Company: Codetheist, LLC
# Email: codetheist@codetheist.com

print("Vowels Count")

#exit_code: 0


def vowels_counter():
    vowels = ['a', 'e', 'i', 'o', 'u']

    #exit_code: 0
    print("If you wish to exit the press 0.")
    user_input = input("Enter a word: ")

    while user_input != 0:
        user_input = input("Enter a word: ")

        for vowel in vowels:
            user_input.find(vowels)
            vowel += 1

        print(
            f"The word you entered is: {user_input} and it has a total of {vowel} vowels.")


vowels_counter()
