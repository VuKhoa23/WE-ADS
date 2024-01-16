# GENERAL
### Create your own .env file and specify PORT and MAP_KEY
### For backend. Specify DB_URI. Example: DB_URI='mongodb://localhost:27017/WeAdsLocal'

# FRONT END

- cd WeAds-FrontEnd
- create .env file
- npm run dev
- Search for localhost:PORT on browser

# BACK END

- cd WeAds-BackEnd
- create .env file specify PORT, MAP_KEY, MONGO_DATABASE, JWT_SECRET_TOKEN, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- npm start
- Search for localhost:PORT/weads/home on browser
- Backend URLS
  - Views: /weads/home, /weads/report
  - Apis: /api/weads-admin/
