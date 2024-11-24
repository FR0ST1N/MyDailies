# MyDailies

A simple, open-source and self-hosted habit tracker app.

![Banner](banner.png)

[Click here for screenshots.](screenshots)

## Features

- Simple UI 👌
- Dark mode 🌕
- Easy deployment with [Docker][1]. 🐋

## Deployment

> Make sure you have [Docker][1] and [Docker Compose][2] installed.

1. Clone the repo.
```bash
git clone https://github.com/FR0ST1N/MyDailies.git
```
2. Go to project root.
```bash
cd MyDailies
```
3. Set `JWT_SECRET_KEY` environment variable in the api [Dockerfile](Dockerfile).
4. Run docker compose.
```bash
docker compose up
```
5. Create the first user (this user will be an admin and can add more users from the users page accessed from the menu).
```bash
curl -X POST http://localhost:8080/api/user/setup-admin \
-H 'Content-Type: application/json' \
-d '{"email": "email@example.com", "password": "password", "name": "Your Name", "timezone": "TZ database name"}'
```

[List of tz database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

## Development

### Start server

#### API Server

Make sure you have air installed. If not, install it from [here](https://github.com/air-verse/air).

- Start API server with `air`

#### Web Server

CD into the web directory and run the following commands.

- Install dependencies `npm ci`
- Start the server `npm start`

### Run tests

- API unit test can be run using `go test ./...`

### Code Formatting

- API `gofmt -w -s .`
- Web `npm run format`

## License

- [MIT](LICENSE)

[1]: https://www.docker.com/
[2]: https://docs.docker.com/compose/
