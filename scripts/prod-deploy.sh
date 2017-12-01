BUILD_VERSION=$(echo $TRAVIS_TAG | cut -d'-' -f 2)
branch=$(echo "release-$BUILD_VERSION")
echo "TRAVIS_TAG: $TRAVIS_TAG"
echo "BUILD_VERSION: $BUILD_VERSION"
echo "branch: $branch"
node scripts/update-versions.js
git config credential.helper "store --file=.git/credentials"
echo "https://${GH_TOKEN}:@github.com" > .git/credentials
git checkout -b $branch
git add . && git commit -m "${BUILD_VERSION}" && git push origin $branch
git tag $BUILD_VERSION
git push origin $BUILD_VERSION
curl -X POST -d '{"title":"'"$BUILD_VERSION"'","head":"'"$branch"'","base":"master"}' -H "Content-Type: application/json" -H "Authorization: token ${GH_TOKEN}" https://api.github.com/repos/chris-ramon/dashboard/pulls
