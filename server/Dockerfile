FROM openjdk:21-jdk-slim

WORKDIR /app

COPY target/skpbackend-0.0.1-SNAPSHOT.jar server.jar

ENTRYPOINT ["java", "-jar", "server.jar"]
