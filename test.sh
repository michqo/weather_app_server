curl --header "Content-Type: application/json" \
	 --request POST \
	 --data '{"y":2021,"m":12,"d":11,"h":22,"averageTemp":"-2"}' \
	 http://localhost:3030/add_temp
