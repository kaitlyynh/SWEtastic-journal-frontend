github:
	-git commit -a
	git push origin main

tests:
	npx jest --silent

delpoy: tests
	git push heroku main