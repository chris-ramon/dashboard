echo $TRAVIS_TAG
git checkout -b release
git add . && git commit -m "$TRAVIS_TAG" && git push origin release
curl -X POST -d '{"title":"test","head":"release","base":"master"}' -H "Content-Type: application/json" -H "Authorization: token ${GH_TOKEN}" https://api.github.com/repos/chris-ramon/dashboard/pulls
