import csv
import json
import collections
import time
import numpy as np
import json as simplejson

money = {}
csvfile = open('money_export.csv', 'r')
csvReader = csv.DictReader(csvfile,delimiter=',')

# with open('weapons/money.json') as data_file:
#     data = json.load(data_file)

for i, line in enumerate(csvReader):
    print i,line['Country Name']

    if line['Country Name'] not in money:
        money[line["Country Name"]] = {}

    for i in xrange(1992, 2010):
        money[line["Country Name"]][str(i)] = {}

    for i in xrange(1992, 2010):
        money[line["Country Name"]][str(i)] = {"amount": line[str(i)]}

print money

jsonfile = open('weapons/money.json', 'w')
money = json.dumps(money, indent=4, sort_keys=False, ensure_ascii=False)
jsonfile.write(money)
jsonfile.close()
