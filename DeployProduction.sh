cd /home/bunko
git pull
cd backend
source venv/bin/activate
pip install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
cd ../frontend;
npm install;
npm run build;
nginx -t;
nginx -s reload;
