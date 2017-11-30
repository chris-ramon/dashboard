version=$TRAVIS_TAG | cut -d'-' -f 2
echo "TRAVIS_TAG: $TRAVIS_TAG"
echo "GH_TOKEN: $GH_TOKEN"
echo "version: $version"
git config credential.helper "store --file=.git/credentials"
echo "https://${GH_TOKEN}:@github.com" > .git/credentials
git checkout -b release
git add . && git commit -m "${version}" && git push origin release
git tag -d $version
git push origin :refs/tags/$version
git tag $version
git push origin $version
curl -X POST -d '{"title":"'"$version"'","head":"release","base":"master"}' -H "Content-Type: application/json" -H "Authorization: token ${GH_TOKEN}" https://api.github.com/repos/chris-ramon/dashboard/pulls
