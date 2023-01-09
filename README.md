# Annotate

`Annotate` let's you easily create and manage your audio annotation projects. You can learn more
about the application and the development thought process behind it [here](docs/OVERVIEW.md).

## Table of contents

- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Browser compatibility](#browser-compatibility)
- [Commands](#commands)

## Quick start

- Project Requirements: `>= Node 17.6.0`, `>= Npm 8.5.1`

Install requirements, clone the project, install npm dependencies, set environment variables, and run `npm run dev` to launch development environment.

## Configuration

To configure the application, `cp .env.local.example .env.local` and modify the values to suit your needs. Here are the list of variables:

- `MONGODB_URI` -> The MongoDb connection string. See [MongoDB Connection String URI format](https://docs.mongodb.com/manual/reference/connection-string/#standard-connection-string-format) for more information
- `ANNOTATE_AWS_KEY_ID` -> AWS key id
- `ANNOTATE_AWS_SECRET_ACCESS_KEY` -> AWS secret access key
- `NEXT_PUBLIC_ANNOTATE_AWS_S3_BUCKET` -> AWS S3 Bucket name. Used to store all project related files
- `NEXT_PUBLIC_ANNOTATE_AWS_S3_BUCKET_REGION` -> AWS S3 Bucket region
- `AUTH_USER` -> Basic auth user name. Add to enable basic auth
- `AUTH_PWD` -> Basic auth password. Add to enable basic auth

## Tech stack

High level overview of the stack:

- [Next.js](https://github.com/vercel/next.js) - ReactJS framework
- [MongoDB](https://www.mongodb.com) - Database
- [Redux](https://github.com/reduxjs/redux) - Global state management
- [AWS S3](https://aws.amazon.com/s3) - File storage
- [Styled Components](https://github.com/styled-components) - Styling

## Project structure

```markdown
📦annotate
 ┣ 📂docs                         # Additional project documentation
 ┣ 📂public                       # Next.js static files - Learn more: https://nextjs.org/docs/basic-features/static-file-serving
 ┃ ┣ 📂locales                    # Next-i18next locales - Learn more: https://github.com/isaachinman/next-i18next#2-translation-content
 ┣ 📂src
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂elements                 # Components used in layouts
 ┃ ┃ ┣ 📂icons                    # Custom SVG icons
 ┃ ┃ ┣ 📂layouts                  # Page layouts
 ┃ ┣ 📂models                     # Mongoose models - Learn more: https://mongoosejs.com/docs/models.html
 ┃ ┣ 📂pages                      # Next.js pages - Learn more: https://nextjs.org/docs/basic-features/pages
 ┃ ┃ ┣ 📂api                      # Next.js API routes - Learn more: https://nextjs.org/docs/api-routes/introduction
 ┃ ┣ 📂store                      # Redux store
 ┃ ┃ ┣ 📂slices                   # Redux toolkit slices - Learn more: https://redux-toolkit.js.org/usage/usage-guide#creating-slices-of-state
 ┃ ┣ 📂theme                      # UI theming & global styles
 ┃ ┣ 📂utils                      # Utils used by API
 ┃ ┃ ┣ 📂middlewares              # API middlewares
 ┣ 📜.editorconfig
 ┣ 📜.env.local.example           # Next.js env vars example file - Learn more: https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables
 ┣ 📜.eslintrc.json
 ┣ 📜.gitignore
 ┣ 📜CHANGELOG.md
 ┣ 📜README.md
 ┣ 📜commitlint.config.js
 ┣ 📜global.d.ts                  # Custom global typings
 ┣ 📜next-env.d.ts
 ┣ 📜next-i18next.config.js       # Next-i18next config file - Learn more: https://github.com/isaachinman/next-i18next#next-i18nextconfigjs
 ┣ 📜next.config.js               # Next.js config file - Learn more: https://nextjs.org/docs/api-reference/next.config.js/introduction
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┗ 📜tsconfig.json
```

## Browser compatibility

This project has been tested with Safari 15.2, Chrome 99.0.4844.51 and Firefox 98.0.1.
If necessary, polyfills can be added in the [_app.tsx](/src/pages/_app.tsx) file.

## Commands

- `dev`: Launch development server (accessible on localhost).
- `build`: Launch Next.js build.
- `start`: Start web server (based on last build).
- `lint`: Lint project.
- `analyze`: Launches bundle analyzer for project.
- `release`: Creates a new release using [release-it](https://github.com/release-it/release-it).