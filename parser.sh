BASEDIR=$(dirname "$0")
cd "$BASEDIR";

cd css/_css ; python parser.py
cd ../..
cd js/_js ; python parser.py