echo $TRAVIS_TAG
echo $GH_TOKEN
git config credential.helper "store --file=.git/credentials"
echo "https://${GH_TOKEN}:@github.com" > .git/credentials
git checkout -b release
git add . && git commit -m "${TRAVIS_TAG}" && git push origin release
git push origin :refs/tags/$TRAVIS_TAG
git tag -fa $TRAVIS_TAG
git push origin master --tags
curl -X POST -d '{"title":"'"$TRAVIS_TAG"'","head":"release","base":"master"}' -H "Content-Type: application/json" -H "Authorization: token ${GH_TOKEN}" https://api.github.com/repos/chris-ramon/dashboard/pulls
