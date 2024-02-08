#!/bin/bash
# in case of neccessary dependencies comment in the following
# add packages via pip install --target ./package name

cd package
zip -r ../plungestreak-api.zip .
cd ..

zip plungestreak-api.zip *.py