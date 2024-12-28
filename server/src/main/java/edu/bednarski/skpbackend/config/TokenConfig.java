package edu.bednarski.skpbackend.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TokenConfig {

    @Value("${access.token.expiration.minutes}")
    private Long accessExpireMinutes;

    @Value("${refresh.token.expiration.minutes}")
    private Long refreshExpireMinutes;

    @Value("${token.secret.key}")
    private String secretKey;

}
