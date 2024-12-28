package edu.bednarski.skpbackend.config;

import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "default.root")
@Configuration
public class RootConfig extends UserDetailsDto {
}