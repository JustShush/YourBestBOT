all: init run

init: config
	npm i
	@echo "Node Modules downloaded!"

config:
	@touch config.json
	@echo "{\n\t\"TOKEN\": \"\",\n\t\"MONGO_URI\": \"\",\n\t\"ClientID\": \"\",\n\t\"DevGuild\": \"\"\n}" > config.json

run:
	clear && node .