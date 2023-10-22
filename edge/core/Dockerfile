# Multi-stage builds for your Java container
FROM maven:3.9.5-eclipse-temurin-21 AS build
RUN mkdir /project
COPY . /project
WORKDIR /project
RUN mvn clean package -DskipTests

FROM openjdk:21-jdk
RUN mkdir /app
COPY --from=build /project/target/core-1.0-SNAPSHOT-jar-with-dependencies.jar /app/core-1.0-SNAPSHOT-jar-with-dependencies.jar
WORKDIR /app
CMD "java" "-jar" "core-1.0-SNAPSHOT-jar-with-dependencies.jar"
# CMD ["sleep", "1000000"]