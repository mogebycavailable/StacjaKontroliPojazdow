package edu.bednarski.skpbackend.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "inspection.time")
@Configuration
@AllArgsConstructor
@NoArgsConstructor
@Data
public class InspectionTimeConfig {

    private Integer divider;

    private Integer carCycles;

    private Integer lpgCycles;

    private Integer truckCycles;

    private Integer vintageCycles;

    private Integer motorcycleCycles;

    private Integer slowMovingCycles;

}
