#!/bin/bash


# this function is called when Ctrl-C is sent
function cleanup ()
{
    echo "Removing dist folder . . ."
    rm -rf dist
}
 

# initialise trap to call cleanup function
# when signal 2 (SIGINT) is received
trap "cleanup" 2


echo "Testing if this package can be install properly . . ."

sudo npm install . --global
if [ $? -eq 0 ]; then
    echo "OK!"
else
    echo "Error: Test installation failed."
    exit -1
fi


echo "Generating dist folder which contains the transpiled Javascript"
cd ts
tsc --outDir ../dist
cd ..

cleanup()

echo "Publish package . . ."
npm publish


echo "Done."