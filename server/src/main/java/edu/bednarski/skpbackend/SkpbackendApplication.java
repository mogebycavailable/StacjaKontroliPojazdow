package edu.bednarski.skpbackend;

import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.UserDto;
import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.repositories.UserRepository;
import edu.bednarski.skpbackend.services.AuthenticationService;
import lombok.extern.java.Log;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@Log
public class SkpbackendApplication implements CommandLineRunner {

	private AuthenticationService authenticationService;

	private UserRepository userRepository;

	private PasswordEncoder passwordEncoder;

	public SkpbackendApplication(AuthenticationService authenticationService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.authenticationService = authenticationService;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public static void main(String[] args) {
		SpringApplication.run(SkpbackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		if(userRepository.findByEmail("root@skp.pl").isEmpty()) {
			UserDetailsDto userDetailsDto = UserDetailsDto
					.builder()
					.email("root@skp.pl")
					.pwdHash("root")
					.build();
			authenticationService.register(userDetailsDto);
			log.info("Aplikacja uruchamia sie pierwszy raz.");
			log.info("Uwtorzono konto root'a z nastepujacymi danymi:");
			log.info("\tE-mail: root@skp.pl");
			log.info("\tHaslo: root");
		}
	}
}
