## Available Scripts

Frontend:

cd StorySizing <br />
npm install  <br />
npm start

Backend:

cd backend  <br />
npm install  <br />
npm start

Commit and push:

git add .  <br />
git commit -m "description"  <br />
git push origin main

git add README.md  <br />
git commit -m "Update README"  <br />
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

