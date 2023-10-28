import random
import time

print("|*************************************************************************|")
print("|    #     #     #     |#     | ########## |\       /|     #     |#     | |")
print("|    #     #    # #    | #    | ##         | \     / |    # #    | #    | |")
print("|    #*****#   #   #   |  #   | ##  ###### |  \   /  |   #   #   |  #   | |")
print("|    #     #  #*****#  |   #  | ##      ## |   \_/   |  #*****#  |   #  | |")
print("|    #     # #       # |    # | ########## |         | #       # |    # | |")
print("|*************************************************************************|\n")

player_name = input("Enter your name: ")

print(f"Hello, {player_name} let's play Hangman")
time.sleep(1)

print("Here are the instructions for this game:")
time.sleep(1)

print("1. You'll guess a letter.")
time.sleep(1)
print("2. After guessing a letter, don't forget to hit the enter key.")
time.sleep(2)

print(f"Simple, right? Anyway, let's play the game {player_name}")
time.sleep(1)

secret_word = []
wordBank = open("./Python/Games/Hangman/Hangman_Word_Bank.txt", "r")
for i in wordBank:
    game_words = str(i)
    game_words = game_words.rstrip("\n")
    if len(game_words) > 2:
        secret_word.append(game_words)
wordBank.close()


def picking_words(secret_word):
    ran_word = random.sample(secret_word, 1)
    ran_word = str(ran_word[0]).upper()
    return ran_word


def starting_game(ran_word):
    start = ""
    for i in range(len(ran_word)):
        start += "_"
    return start


def player_input(player_guesses, game_words):
    for i in player_guesses:
        print(i, end=" ")
    play_guess = input("Enter a letter: ")
    play_guess = str(play_guess).upper()

    if len(play_guess) > 1 or play_guess == "":
        return player_guesses
    else:
        result = matching_words(play_guess, player_guesses, game_words)
        return result


def matching_words(play_guess, player_guesses, game_words):
    player_guesses_list = list(player_guesses)
    for i in range(len(game_words)):
        if play_guess == game_words[i]:
            player_guesses_list[i] = play_guess
    wrds = ""
    for x in player_guesses_list:
        wrds += x
    return wrds


def game_play(player_guesses, game_words):
    guess_attempts = 0
    # max_guess = 8
    max_guess = len(game_words) + 2

    while True:
        if guess_attempts >= max_guess:
            print("")
            print("Guess limits reached.")
            print("Game Over!")
            print("")
            print("Word is: " + game_words)
            break

        print("Number of Guesses left: ", (max_guess - guess_attempts))
        answer = player_input(player_guesses, game_words)

        if answer == player_guesses:
            print("")
            guess_attempts += 1
            print("Try again.")
            print("")

        else:
            player_guesses = answer
            print("")

        if answer.count("_") == 0:
            print("")
            print("Congrats. You won!")
            print("")
            print("Word is: " + game_words)
            break

    print("")
    print("Do you want to play again? ")
    print("")

    play_again = input("Enter Y for Yes or N for No: ")

    while True:
        if play_again == "Y" or play_again == "y":
            # BEGIN: be15d9bcejpp
            print(f"Simple, right? Anyway, let's play the game {player_name}")
            time.sleep(1)

            secret_word = []
            wordBank = open("./Python/Games/Hangman/Hangman_Word_Bank.txt", "r")
            for i in wordBank:
                game_words = str(i)
                game_words = game_words.rstrip("\n")
                if len(game_words) > 2:
                    secret_word.append(game_words)
            wordBank.close()

            ran_word = picking_words(secret_word)
            player_guesses = starting_game(ran_word)
            game_play(player_guesses, ran_word)
            # END: be15d9bcejpp
        elif play_again == "N" or play_again == "n":
            print("")
            print("Thanks for playing!")
            print("")
            break
        else:
            print("")
            print("Invalid input. Please enter Y or N.")
            print("")
            play_again = input("Enter Y for Yes or N for No: ")

print("2. After guessing a letter, don't forget to hit the enter key.")
time.sleep(2)


print(f"Simple, right? Anyway, let's play the game {player_name}")
time.sleep(1)

secret_word = []
wordBank = open("./Python/Games/Hangman/Hangman_Word_Bank.txt", "r")
for i in wordBank:
    game_words = str(i)
    game_words = game_words.rstrip("\n")
    if len(game_words) > 2:
        secret_word.append(game_words)
wordBank.close()


def picking_words(secret_word):
    ran_word = random.sample(secret_word, 1)
    ran_word = str(ran_word[0]).upper()
    return ran_word


def starting_game(ran_word):
    start = ""
    for i in range(len(ran_word)):
        start += "_"
    return start


def player_input(player_guesses, game_words):
    for i in player_guesses:
        print(i, end=" ")
    play_guess = input("Enter a letter: ")
    play_guess = str(play_guess).upper()

    if len(play_guess) > 1 or play_guess == "":
        return player_guesses
    else:
        result = matching_words(play_guess, player_guesses, game_words)
        return result


def matching_words(play_guess, player_guesses, game_words):
    player_guesses_list = list(player_guesses)
    for i in range(len(game_words)):
        if play_guess == game_words[i]:
            player_guesses_list[i] = play_guess
    wrds = ""
    for x in player_guesses_list:
        wrds += x
    return wrds


def game_play(player_guesses, game_words):
    guess_attempts = 0
    # max_guess = 8
    max_guess = len(game_words) + 2

    while True:
        if guess_attempts >= max_guess:
            print("")
            print("Guess limits reached.")
            print("Game Over!")
            print("")
            print("Word is: " + game_words)
            break

        print("Number of Guesses left: ", (max_guess - guess_attempts))
        answer = player_input(player_guesses, game_words)

        if answer == player_guesses:
            print("")
            guess_attempts += 1
            print("Try again.")
            print("")

        else:
            player_guesses = answer
            print("")

        if answer.count("_") == 0:
            print("")
            print("Congrats. You won!")
            print("")
            print("Word is: " + game_words)
            break

    print("")
    print("Do you want to play again? ")
    print("")

    play_again = input("Enter Y for Yes or N for No: ")

    while True:
        if play_again == "Y" or play_again == "y":
            game_play(player_guesses, game_words)
            continue
        elif play_again == "N" or play_again == "n":
            print("")
            print(f"Thanks for playing {player_name}!")
            exit()
        elif play_again != "Y" or play_again != "y" or play_again != "N" or play_again != "n":
            print("")
            print(f"{player_name}, Please select either Y for Yes or N for No.")
            play_again = input("Enter Y for Yes or N for No: ")


game_words = picking_words(secret_word)
player_guesses = starting_game(game_words)
game_play(player_guesses, game_words)
