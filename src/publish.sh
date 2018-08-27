#!/bin/bash

# this function is called when Ctrl-C is sent
function cleanup ()
{
    echo "Git ignoring dist and build folder again . . ."
    sed -i "s/#dist/dist/g" .gitignore
    sed -i "s/#build/build/g" .gitignore
    echo "Done cleanup."
}
 

# initialise trap to call cleanup function
# when signal 2 (SIGINT) is received
trap "cleanup" 2

# Unignore dist and build folder, because it needs to be published
sed -i "s/dist/#dist/g" .gitignore
sed -i "s/build/#build/g" .gitignore

echo "Testing if this package can be install properly . . ."

sudo npm install . --global
if [ $? -eq 0 ]; then
    echo "OK!"
else
    echo "Error: Test installation failed."
    exit -1
fi

echo "Generating dist folder which contains the transpiled Javascript . . ."
./build.sh 0

echo "Publish package . . ."
npm publish

cleanup

echo "Done."