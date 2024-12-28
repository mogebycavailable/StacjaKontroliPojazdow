package edu.bednarski.skpbackend.config;

import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "default.root")
@Configuration
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RootConfig {

    private String email;

    private String password;

    public UserDetailsDto buildRootUser() {
        return UserDetailsDto
                .builder()
                .email(this.email)
                .pwdHash(this.password)
                .build();
    }

}
