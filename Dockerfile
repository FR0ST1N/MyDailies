FROM golang:1.19-alpine AS build
WORKDIR /app
RUN apk --no-cache add gcc musl-dev
COPY go.mod go.sum ./
RUN go mod download && go mod verify
COPY . .
RUN go build -o mydailies

FROM alpine:3.14
WORKDIR /app
COPY --from=build /app/mydailies ./
ENV PORT 8080
ENV GIN_MODE release
ENV JWT_SECRET_KEY test
EXPOSE 8080
ENTRYPOINT ["./mydailies"]
