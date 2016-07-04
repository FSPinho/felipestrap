import os
import re

def getHexByColor(color):
	mdlFile = open("../material.min.css")
	mdl = mdlFile.read()
	mdlFile.close()
	#mdlColors = re.findall("mdl-color-{1,2}[a-zA-Z0-9]+-{0,2}[a-zA-Z0-9]*-{0,2}[a-zA-Z0-9]*\s*{\s*background-color\s*:\s*#[a-zA-Z0-9]{6}", mdl)
	mdlColors = re.findall("mdl-color-{0,2}[a-zA-Z0-9]*-{0,2}" + color + "-{0,2}[a-zA-Z0-9]*-{0,2}[a-zA-Z0-9]*\s*{\s*background-color\s*:\s*#[a-zA-Z0-9]{6}", mdl)
	mdlTextColors = re.findall("mdl-color-{0,2}[a-zA-Z0-9]*-{0,2}" + color + "-{0,2}[a-zA-Z0-9]*-{0,2}[a-zA-Z0-9]*\s*{\s*color\s*:\s*#[a-zA-Z0-9]{6}", mdl)
	mdlColors = [{"name": re.findall("mdl-color-{1,2}[a-zA-Z0-9]+-{0,2}[a-zA-Z0-9]*-{0,2}[a-zA-Z0-9]*", c)[0], "color": re.findall("#[a-zA-Z0-9]{6}", c)[0]} for c in mdlColors]
	mdlTextColors = [{ "name" : re.findall("mdl-color-{1,2}[a-zA-Z0-9]+-{0,2}[a-zA-Z0-9]*-{0,2}[a-zA-Z0-9]*", c)[0], "color": re.findall("#[a-zA-Z0-9]{6}", c)[0]} for c in mdlTextColors]
	colors = mdlColors + mdlTextColors
	for c in colors:
		print c

output = open("../sinutri.css", "w")
outputText = ""
files = [f for f in os.listdir(".") if os.path.isfile(f) and f.endswith(".css")]

for f in files:
	partFile = open(f, "r")
	part = partFile.read()
	outputText += "/* " + f + " */\n\n" + part + "\n\n\n"
	partFile.close()


rootFileText = open("_root.css").read()
rootVars = re.findall("", rootFileText)


output.write(outputText)
output.close()
