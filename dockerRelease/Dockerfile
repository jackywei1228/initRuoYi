FROM docker.io/library/eclipse-temurin:8-jre

WORKDIR /app

COPY ruoyi-admin.jar /app/ruoyi-admin.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/ruoyi-admin.jar", "--spring.config.additional-location=/app/config/"]
