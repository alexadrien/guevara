save:
	git add . && git commit -m "Save" && git push

link:
	npm link

init:
	guevara init

dev:
	git checkout master
	make save
	guevara dev

pr:
	guevara pr

publish:
	make save
	npm version patch
	npm publish