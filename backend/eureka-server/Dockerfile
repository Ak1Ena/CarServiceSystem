# ---------- Build stage ----------
FROM maven:3.9.6-eclipse-temurin-11 AS builder
WORKDIR /build
COPY pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests package


# ---------- Run stage ----------
FROM eclipse-temurin:11-jre
WORKDIR /app
ENV JAVA_OPTS=""
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -ms /bin/bash appuser
COPY --from=builder /build/target/eureka-server-0.0.1-SNAPSHOT.jar /app/app.jar
RUN chown -R appuser:appuser /app
USER appuser
EXPOSE 8761
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
