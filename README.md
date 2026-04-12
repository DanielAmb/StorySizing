## Available Scripts

Frontend:

cd StorySizing

npm install

npm start

Backend:

cd backend

npm install

npm start

Commit and push:

git add .

git commit -m "description"

git push origin main

git add README.md

git commit -m "Update README"

git push origin main

Before development:

git pull origin main


### Deployment

Deploy Frontend (GitHub Pages)

From frontend folder:

cd StorySizing

Build and publish:

npm run deploy

From backend folder:

func azure functionapp publish storysizing-api --javascript

Reset backend

Azure Portal -> storysizingstore -> Data Storage -> Containers -> Delete teams.json

