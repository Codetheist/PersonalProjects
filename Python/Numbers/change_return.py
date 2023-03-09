# Change Return Program - The user enters a cost and then the amount of money
# given. The program will figure out the change and the number of
# quarters, dimes, nickels, pennies needed for the change.
# Author: Codetheist
# Company: Codetheist, LLC
# Email: codetheist@codetheist.com

cost = float(input("Enter the cost: $"))
amount_tender = float(input("Enter the amount: $"))


def change_return():
    dollar = int(amount_tender - cost)
    change = (amount_tender - dollar - cost)

    if(change > 0):

        print(f"\nYour change: $%.2f" % (amount_tender - cost))

        cash_calculation(dollar)
        coins_calculation(change)
    else:
        print("Cash not render can't return negative currency.")


def cash_calculation(dollar):
    # USD currency value
    one_hundred_dollars = 100
    fifty_dollars = 50
    twenty_dollars = 20
    ten_dollars = 10
    five_dollars = 5
    one_dollar = 1

    # Currency count
    one_hundred_dollars_count = 0
    fifty_dollars_count = 0
    twenty_dollars_count = 0
    ten_dollars_count = 0
    five_dollars_count = 0
    one_dollar_count = 0

    if(dollar >= 100 and dollar >= 50):
        dollars = int(dollar / one_hundred_dollars)
        one_hundred_dollars_count = dollars % one_hundred_dollars

    if(dollar >= 50 and dollar >= 20):
        dollars = int(dollar / fifty_dollars)
        fifty_dollars_count = dollars % fifty_dollars

    if(dollar >= 20 and dollar >= 10):
        dollars = int(dollar / twenty_dollars)
        twenty_dollars_count = dollars % twenty_dollars

    if(dollar >= 10 and dollar >= 5):
        dollars = int(dollar / ten_dollars)
        ten_dollars_count = dollars % ten_dollars

    if(dollar >= 5 and dollar >= 1):
        dollars = int(dollar / five_dollars)
        five_dollars_count = dollars % five_dollars

    if (dollar >= 1):
        one_dollar_count = dollar

    print(f"\nCash amount: $%.2f" % dollar)
    print(f"Hundreds amount: %.0f" % one_hundred_dollars_count)
    print(f"Fifties amount: %.0f" % fifty_dollars_count)
    print(f"Twenties amount: %.0f" % twenty_dollars_count)
    print(f"Tens amount: %.0f" % ten_dollars_count)
    print(f"Fives amount: %.0f" % five_dollars_count)
    print(f"Ones amount: %.0f" % one_dollar_count)


def coins_calculation(change):
    # USD currency amount
    quarters = 0.25
    dimes = 0.10
    nickels = 0.05
    pennies = 0.01

    # Currency count
    quarter_count = 0
    dime_count = 0
    nickel_count = 0
    penny_count = 0

    if(change / quarters):
        quarter_count = int(change % quarters)

    if(change / dimes):
        dime_count = int(change / dimes)

    if(change / nickels):
        nickel_count = int(change / nickels)

    if(change / pennies):
        penny_count = int(change / pennies)

    print(f"\nChange amount: $%.2f" % change)
    print(f"Quarter amount: {quarter_count}")
    print(f"Dime amount: {dime_count}")
    print(f"Nickel amount: {nickel_count}")
    print(f"Penny amount: {penny_count}")


change_return()
