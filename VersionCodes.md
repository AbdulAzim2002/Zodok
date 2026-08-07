# Version Codes
[Ver].[Date].[Mod].[Dev].[Seq] 

## Version
v1 = Shop Development Stage
v2 = Shop Production Stage

## Date
[YYMMDD] for example on 19th May 2025 it will be 250519

## Modules
0 = Nothing
1 = Component Level
2 = Page Level
3 = Asset Level
4 = API Level
5 = Documentation Level

## Developers
01 = Abdul Azim Shaikh
02 = Ashwin Kamath
03 = Mallik Narsina
04 = Sunny Kumar Pandit

## Sequence
three digit for sequence
starting with 001 and increment accordingly to new commits made on the same day,
reset to 001 on next day

## Commit Message
feat() -> new feature for the user
fix() -> bug fix for the user
chore() -> changes to the build process or auxiliary tools and libraries such as documentation generation
style() -> changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
refactor() -> A change that neither fixes a bug or adds a feature
perf() -> A change that improves performance
test() -> Adding missing tests or correcting existing tests
docs() -> Documentation changes

## Example
git commit -m "v1.250519.1.01.001 - feat(auth): add signup screen"

