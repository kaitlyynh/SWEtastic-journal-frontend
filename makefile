github:
	-git commit -a
	git push origin main

tests:
	npx jest

delpoy: tests
	git push heroku main