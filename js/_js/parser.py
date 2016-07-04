import os
import re

output = open("../sinutri.js", "w")
outputText = ""
files = [f for f in os.listdir(".") if os.path.isfile(f) and  f.endswith(".js")]
files.sort()

for f in files:
	partFile = open(f, "r")
	part = partFile.read()
	outputText += "/* " + f + " */\n\n" + part + "\n\n\n"
	partFile.close()

output.write(outputText)
output.close()
