DATA='{"y":2022,"m":3,"d":28,"h":21,"averageTemp":"22.17"}'
URL="http://localhost:8000"
METHOD="add_temp"
URL_BOTH=""

if [ "$1" = "last" ]; then
  METHOD="add_last_temp"
elif [ "$1" = "both" ]; then
  URL_BOTH="$URL/add_last_temp"
fi

curl --header "Content-Type: application/json" \
     --request POST \
     --data $DATA \
     "$URL/$METHOD" $URL_BOTH
