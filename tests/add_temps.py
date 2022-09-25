import requests
import datetime
import random
import sys
import dataclasses
from dataclasses import dataclass

URL = "http://localhost:8000"
add_url = "{}/add_temps".format(URL)

@dataclass
class Temp:
    y: int
    m: int
    d: int
    h: int = 0
    averageTemp: str = ""

now = datetime.datetime.now()
data = Temp(now.year, now.month, now.day)
temps: list[dict] = []

def main():
    if len(sys.argv) > 1:
        if sys.argv[1].isdigit():
            data.d = int(sys.argv[1])
    
    for i in range (0, 24):
        lower = random.uniform(21, 22.5)
        upper = random.uniform(22.5, 24.5)
        temp = random.uniform(lower, upper)
        data.averageTemp = str(round(temp, 2))
        data.h = i
        temps.append(dataclasses.asdict(data))

    requests.post(add_url, json=temps)

if __name__ == "__main__":
    main()
