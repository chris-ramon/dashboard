echo "tag: $0"
echo $1
git config --global user.email "rchristian.ramon@gmail.com"
git config --global user.name "Travis-CI"
git config credential.helper "store --file=.git/credentials"
echo "https://${GH_TOKEN}:@github.com" > .git/credentials
npm run build
ls
git checkout release
git add . && git commit -m "$0" && git push origin release
curl -X POST -d '{"title":"test","head":"release","base":"master"}' -H "Content-Type: application/json" -H "Authorization: token ${GH_TOKEN}" https://api.github.com/repos/chris-ramon/dashboard/pulls
