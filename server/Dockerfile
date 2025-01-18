FROM openjdk:21-jdk-slim

WORKDIR /server

COPY target/*.jar server.jar

ENTRYPOINT ["java", "-jar", "server.jar"]