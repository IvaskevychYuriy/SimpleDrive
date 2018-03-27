# SimpleDrive
File sharing system

## FAQ

How to do migrations?

1. Restore NuGet packages for solution
2. Open `View -> Other Windows -> Package Manager Console`
3. Make sure that `Default project` is `SimpleDrive.DAL`
4. Run `Add-Migration SomeUniqueMigrationTitle`