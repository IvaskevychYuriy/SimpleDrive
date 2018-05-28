# [SimpleDrive](https://simpledrive.azurewebsites.net) [![Build status](https://ci.appveyor.com/api/projects/status/b2gaxlk1byh9uthr/branch/dev?svg=true)](https://ci.appveyor.com/project/SimpleDriveOrganization/simpledrive/branch/dev)

## Description

File sharing system

[Specs](https://docs.google.com/document/d/19CF6aetz2xZV3bxius6UmRTRwb339w5ZSGN2BGqyNU8/edit?usp=sharing)

## FAQ

How to do migrations?

1. Restore NuGet packages for solution
2. Open `View -> Other Windows -> Package Manager Console`
3. Make sure that `Default project` is `SimpleDrive.DAL`
4. Run `Add-Migration SomeUniqueMigrationTitle`
5. Run `Update-Database`
