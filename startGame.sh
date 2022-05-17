#! /bin/bash

node gameInit.js > gameState.json
round=0

while grep -q true gameState.json
do
  round=$(( $round + 1 ))
  if (( $round % 2 == 1 )) 
  then
    sleep 0.5
    read -p 'Enter the choice : ' choice
    node library.js $choice 'user' 
  else 
    choice=$( seq 25 | sort -R | head -1 )
    sleep 0.5
    echo 'Computer choosen :' $choice
    node library.js $choice 'comp' 
  fi
  if (( $? != 0 ))
  then 
    exit
  fi
done
