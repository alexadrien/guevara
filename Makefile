save:
	git add . && git commit -m "Save" && git push

link:
	npm link

init:
	guevara init

dev:
	make save
	guevara dev

pr:
	guevara pr
