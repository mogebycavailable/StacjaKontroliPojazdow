package edu.bednarski.skpbackend.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "format")
@Configuration
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DateFormatConfig {

    private String date;

    private String datetime;

    private String time;

}
