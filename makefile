github:
	-git commit -a
	git push origin main

tests:
	npm test

delpoy: tests
	git push heroku main