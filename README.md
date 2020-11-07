# Web Organizer
MERN stack web application designed to help you organize your day-to-day routine.

## Table of contents
[Description](#description)<br />
[Architecture](#architecture)<br />
[File structure](#file-structure)<br />
[Current features](#current-features)<br />
[Licence](#licence)<br />

## Description
Web Organizer allows you to add and modify notes with a simple title-body structure. Starting from day 1 the app provides a set of very basic features, however I will be successively expanding it.

## Architecture
Web Organizer consists of several types of files performing different tasks. We can distinguish two basic types:
- `.ejs` files, served as a frontend
- `.js` files, performing most of the tasks on the backend

## File structure
- `/`: root directory containing server/app configuration files and environmental variables<br />
- `/src`: root directory for views, partials, routes, etc.<br />
- `/src/locales`: JSON language packs (WIP)<br />
- `/src/config`: sets of rules used by the authentication module<br />
- `/src/routes`: contains all of the backend routing within the app, including user request handlers<br />
- `/src/models`: contains basic DB schemas used by the application<br />
- `/src/views`: stores all `.ejs` view files and templates served as a frontend<br />
- `/src/views/partials`: stores `.ejs` 'sub-views', loaded either in `layout.ejs` or appropriate view file in `/src/views`<br />

## Current features
- Create, read, update or delete your notes via intuitive user interface<br />
- Modify your personal information<br/>

### Setting up local instance
In order to test the application locally, you have to create `.env` file first in the root directory of the project (`/`).
Next, add the following lines to the file:
```
DB_USERNAME = <username>
DB_PASSWORD = <password>
DB_NAME = <database>
DB_URL = <atlas_cluster_url>
```

You don't have to manually create collections in the database - they will be added automatically with the first item.

## Licence
Web Organizer is being distributed under GPL-3.0 licence.<br />
https://www.gnu.org/licenses/gpl-3.0.html

