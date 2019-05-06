save:
	git add . && git commit -m "Save" && git push -f

link:
	npm link

init:
	rm -f .guevara && guevara init