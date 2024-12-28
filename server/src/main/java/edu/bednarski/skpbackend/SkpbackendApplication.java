package edu.bednarski.skpbackend;

import edu.bednarski.skpbackend.config.RootConfig;
import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.repositories.UserRepository;
import edu.bednarski.skpbackend.services.AuthenticationService;
import lombok.extern.java.Log;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Log
public class SkpbackendApplication implements CommandLineRunner {

	private AuthenticationService authenticationService;

	private UserRepository userRepository;

	private UserDetailsDto rootAccount;

	public SkpbackendApplication(AuthenticationService authenticationService, UserRepository userRepository, RootConfig rootConfig) {
		this.authenticationService = authenticationService;
		this.userRepository = userRepository;
		this.rootAccount = rootConfig.buildRootUser();
	}


	public static void main(String[] args) {
		SpringApplication.run(SkpbackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		if(userRepository.findByEmail("root@skp.pl").isEmpty()) {
			log.info("Aplikacja uruchamia sie pierwszy raz.");
			log.info("Uwtorzono konto root'a z nastepujacymi danymi:");
			log.info(String.format("\tE-mail: %s",rootAccount.getEmail()));
			log.info(String.format("\tHaslo: %s",rootAccount.getPwdHash()));
			authenticationService.register(rootAccount);
		}
	}
}
