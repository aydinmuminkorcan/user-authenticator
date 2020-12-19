# Contributing

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Code of Conduct
We take our open source community seriously and hold ourselves and other contributors to high standards of communication. By participating and contributing to this project, you agree to uphold our [Code of Conduct](CODE-OF-CONDUCT.md).

---
## We Develop with Github
We use github to host code, to track issues and feature requests, as well as accept pull requests.

---
## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html), So All Code Changes Happen Through Pull Requests
Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

---
## Report bugs using Github's [issues](https://github.com/aydinmuminkorcan/user-authenticator/issues)
We use GitHub issues to track public bugs. Report a bug by opening a new issue.

---
## Write bug reports with detail
***Great Bug Reports*** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)
   
#### ***Example***:
  
  ##### Title
  The cart icon doesn't update when adding items

  ##### Steps to reproduce 
  1. Go to a product page 
  2. See that the cart icon on top right (desktop) shows X items
  3. Click "add to cart" button

  ##### Current behaviour 
  The cart icon still shows X items but after reload it updates.

  ##### Expected behaviour 
  The cart icon shows shows X+1 items immediately

  #### Relevant logs and/or screenshots (optional)
  ![bug](https://i.imgur.com/KgmlF2A.png)

  ##### Other comment (optional)
  We need to hit 88mph for the flux capacitor to work

  ##### Reported by
  Lucas

---
## For Consistent Coding Style
We use Airbnb's javascript coding style. For more information: [Airbnb's Javascript Style](https://github.com/airbnb/javascript)

* 4 spaces for indentation rather than tabs (It is already defined in the .prettierrc.json file)
* Run `npm run format` to format your code
* Run `npm run lint` and fix the errors for consistent style.
---
## Commit message standard
The format:

>type: subject
>
>body
>
>footer

1. Type:
   - feat - The new feature you're adding to the application
   - fix - A bug fix
   - docs - Everything related to documentation
   - style - Everything related to styling
   - refactor - Refactoring a specific section of the codebase
   - test - Everything related to testing
   - chore - Updating build tasks, package manager configs

    You can also use [emojis](https://gitmoji.dev/) to represent  commit types.

2. **Subject**:
   
   The short description of the changes made. It should not exceed 50 characters, should begin with a capital letter and should be written in the imperative eg. Add instead of Added or Adds. Please do not end the subject line with a period.

3. **Body (optional)**:
   
    The details of what changes you made and why you made them and not how you made them since they are in the codebase. A blank line between the body and the subject is required and each line should not exceed 72 characters. You can also add the side effects of your change if any. The body may consist of more than one paragraph as long as you put a blank line between them. Bullet points are accepted, too.

4. **Footer (optional)**:
   
    Refers to the reference issue ID in an issue tracker. *Eg: Resolves: #123, Fixes #134*
---
## License
By contributing, you agree that your contributions will be licensed under its MIT License.

---
## References
This document was adapted from the open-source contribution guidelines 