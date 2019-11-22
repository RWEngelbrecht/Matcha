from random import randrange

if __name__=="__main__":
    file1 = open("IPAddresses.txt","w")
    i = 0

    while (i < 1000):
        first = randrange(128,255)
        second = randrange(0, 255)
        ip = ".".join(["155.93",str(first),str(second)])
        file1.write(ip)
        file1.write("\n")
        i = i + 1