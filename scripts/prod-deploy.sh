version=$(echo $TRAVIS_TAG | cut -d'-' -f 2)
branch=$(echo "release-$version")
echo "TRAVIS_TAG: $TRAVIS_TAG"
echo "version: $version"
echo "branch: $branch"
git config credential.helper "store --file=.git/credentials"
echo "https://${GH_TOKEN}:@github.com" > .git/credentials
git checkout -b $branch
git add . && git commit -m "${version}" && git push origin $branch
git tag $version
git push origin $version
curl -X POST -d '{"title":"'"$version"'","head":"'"$branch"'","base":"master"}' -H "Content-Type: application/json" -H "Authorization: token ${GH_TOKEN}" https://api.github.com/repos/chris-ramon/dashboard/pulls
