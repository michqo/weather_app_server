ip := "192.168.0.110"

# build and transfer files
build:
	pnpm build
	scp -rp dist/* pi@{{ip}}:~/weather/server/dist

# transfer other files
other:
	scp -rp package.json pnpm-lock.yaml .env prisma/* pi@{{ip}}:~/weather/server