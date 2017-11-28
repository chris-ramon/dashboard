echo "tag: $0"
echo $1
git config --global user.email "rchristian.ramon@gmail.com"
git config --global user.name "Travis-CI"
git config credential.helper "store --file=.git/credentials"
echo "https://${GH_TOKEN}:@github.com" > .git/credentials
npm run build
ls
git checkout master
git add . && git commit -m "$0" && git push origin master
