package edu.bednarski.skpbackend.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "default.work.day")
@Configuration
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DefaultWorkWeekConfig {

    private Boolean monday, tuesday, wednesday, thursday, friday, saturday, sunday;

    private String start;

    private String end;

}
