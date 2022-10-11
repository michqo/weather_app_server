ip := "192.168.0.110"

rasp:
	scp -rp dist/* pi@{{ip}}:~/weather/server/dist
	scp -rp package.json pnpm-lock.yaml .env prisma/* pi@{{ip}}:~/weather/server
