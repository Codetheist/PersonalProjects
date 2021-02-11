# Tax Calculator - Asks the user to enter a cost and either a country or state tax.
# It then returns the tax plus the total cost with tax.
# Author: Codetheist
# Company: Codetheist, LLC
# Email: codetheist@codetheist.com

country = input("Enter country or currency abbreviation: ")
print("i.e. Unite State or USD or US")

def switch_country(country):
    country_list = {
    "AED":,
    "AFN":
    "ALL":
    "AMD":
    "AOA":
    "ARS":
    "AUD": ["Australia", "Kiribati", "Nauru", "Tuvalu"]
    "AZN":
    "BAM":
    "BBD":
    "BDT":
    "BGN":
    "BHD":
    "BIF":
    "BND":
    "BOB":
    "BRL":
    "BSD":
    "BTN":
    "BWP":
    "BYN":
    "BZD":
    "CAD":
    "CDF":
    "CHF": ["Liechtenstein", "Switzerland"]
    "CLP":
    "CNY":
    "COP":
    "CRC":
    "CUP":
    "CVE":
    "CZK":
    "DJF":
    "DKK":
    "DOP":
    "DZD":
    "EGP":
    "ERN":
    "ETB":
    "EUR": ["Andorra", "Austria", "Belgium", "Cyprus", "Estonia", "Finland", "France", "Germany", "Greece", "Ireland", "Italy", "Kosovo", "Latvia", "Lithuania", "Luxembourg", "Malta", "Monaco", "Montenegro",
            "Netherlands", "Portugal", "San Marino", "Slovakia", "Slovenia", "Spain", "Vatican City"]
    "FJD":
    "GBP":
    "GEL":
    "GHS":
    "GMD":
    "GNF":
    "GTQ":
    "GYD":
    "HNL":
    "HRK":
    "HTG":
    "HUF":
    "IDR":
    "ILS": ["Israel", "Palestine"]
    "INR":
    "IQD":
    "IRR":
    "ISK":
    "JMD":
    "JOD":
    "JPY":
    "KES":
    "KGS":
    "KHR":
    "KMF":
    "KPW":
    "KRW":
    "KWD":
    "KZT":
    "LAK":
    "LBP":
    "LKR":
    "LRD":
    "LSL":
    "LYD":
    "MAD":
    "MDL":
    "MGA":
    "MKD":
    "MMK":
    "MNT":
    "MRO":
    "MUR":
    "MVR":
    "MWK":
    "MXN":
    "MYR":
    "MZN":
    "NAD":
    "NGN":
    "NIO":
    "NOK":
    "NPR":
    "NZD":
    "OMR":
    "PAB":
    "PEN":
    "PGK":
    "PHP":
    "PKR":
    "PLN":
    "PYG":
    "QAR":
    "RON":
    "RSD":
    "RUB":
    "RWF":
    "SAR":
    "SBD":
    "SCR":
    "SDG":
    "SEK":
    "SGD":
    "SLL":
    "SOS":
    "SRD":
    "SSP":
    "STD":
    "SYP":
    "SZL":
    "THB":
    "TJS":
    "TMT":
    "TND":
    "TOP":
    "TRY":
    "TTD":
    "TWD":
    "TZS":
    "UAH":
    "UGX":
    "USD": ["East Timor", "Ecuador", "El Salvador", "Marshall Islands", "Micronesia", "Palau", "United States", "Zimbabwe"]
    "UYU":
    "UZS":
    "VEF":
    "VND":
    "VUV":
    "WST":
    "XAF": ["Cameroon", "Central African Republic", "Chad", "Equatorial Guinea", "Gabon", "Republic of the Congo"]
    "XCD": ["Antigua and Barbuda", "Dominica", "Grenada", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines"]
    "XOF": ["Benin", "Burkina Faso", "Guinea-Bissau", "Ivory Coast", "Mali", "Niger", "Senegal", "Togo"]
    "YER":
    "ZAR":
    "ZMW":
    }


def tax_calculation():
    price = float(input("Enter price: "))

    tax_rate = float(input("Enter tax rate: ")) / 100

    tax_rate = price * tax_rate

    price_total = price + tax_rate

    print(f"Tax: ${round(tax_rate, 2)}")

    print(f"Total ${round(price_total, 2)}")


tax_calculation()
